"""Builds The Plug, a Society town NPC, from the pack's Market NPC (stdlib only).

Writes, relative to the project root:
  config/easy_npc/preset/humanoid/plug.npc.nbt      Easy NPC preset the villager home spawns
  config/easy_npc/skin/humanoid/plug.png            world skin
  kubejs/assets/dialog/textures/portraits/**/plug.png   dialog and shop portraits
  kubejs/assets/society/textures/item/villager_icons/plug.png

The art is the Market's, recoloured: a white suit instead of the orange jacket, plus shades.
Usage: python tools/gen_plug_npc.py [--instance path/to/instance]
"""
import colorsys
import gzip
import hashlib
import os
import struct
import sys
import zipfile
from pathlib import Path

from pngio import read_rgba, write_rgba

ROOT = Path(__file__).resolve().parent.parent
INSTANCE = Path(sys.argv[sys.argv.index("--instance") + 1]) if "--instance" in sys.argv else Path(
    os.environ.get("USERPROFILE", "~"), "curseforge/minecraft/Instances/Society Sunlit Cobblemon"
).expanduser()
SOCIETY_JAR = next((INSTANCE / "mods").glob("society-*.jar"))
EASY_NPC = INSTANCE / "config/easy_npc"
NPC = "plug"


def name_uuid(name):
    """Java's UUID.nameUUIDFromBytes, as the 4 ints NBT stores. Easy NPC finds a custom
    skin file by this UUID of its file name."""
    digest = bytearray(hashlib.md5(name.encode()).digest())
    digest[6] = digest[6] & 0x0F | 0x30
    digest[8] = digest[8] & 0x3F | 0x80
    return list(struct.unpack(">4i", bytes(digest)))


# --- NBT: just enough to round-trip a preset. Numbers are kept as raw bytes. ---
SIZES = {1: 1, 2: 2, 3: 4, 4: 8, 5: 4, 6: 8}


class Reader:
    def __init__(self, data):
        self.data, self.pos = data, 0

    def take(self, n):
        chunk = self.data[self.pos:self.pos + n]
        self.pos += n
        return chunk

    def unpack(self, fmt):
        return struct.unpack(">" + fmt, self.take(struct.calcsize(">" + fmt)))[0]

    def string(self):
        return self.take(self.unpack("H")).decode("utf-8")

    def payload(self, kind):
        if kind in SIZES:
            return self.take(SIZES[kind])
        if kind == 7:
            return self.take(self.unpack("i"))
        if kind == 8:
            return self.string()
        if kind == 9:
            inner, count = self.unpack("b"), self.unpack("i")
            return (inner, [self.payload(inner) for _ in range(count)])
        if kind == 10:
            tags = {}
            while (child := self.unpack("b")) != 0:
                name = self.string()
                tags[name] = (child, self.payload(child))
            return tags
        if kind == 11:
            return [self.unpack("i") for _ in range(self.unpack("i"))]
        if kind == 12:
            return [self.unpack("q") for _ in range(self.unpack("i"))]
        raise ValueError(f"unknown NBT tag {kind}")


def write_string(text):
    raw = text.encode("utf-8")
    return struct.pack(">H", len(raw)) + raw


def write_payload(kind, value):
    if kind in SIZES:
        return value
    if kind == 7:
        return struct.pack(">i", len(value)) + value
    if kind == 8:
        return write_string(value)
    if kind == 9:
        inner, items = value
        return struct.pack(">bi", inner, len(items)) + b"".join(write_payload(inner, v) for v in items)
    if kind == 10:
        return b"".join(
            struct.pack(">b", k) + write_string(name) + write_payload(k, v) for name, (k, v) in value.items()
        ) + b"\x00"
    if kind == 11:
        return struct.pack(">i", len(value)) + struct.pack(f">{len(value)}i", *value)
    if kind == 12:
        return struct.pack(">i", len(value)) + struct.pack(f">{len(value)}q", *value)
    raise ValueError(f"unknown NBT tag {kind}")


def build_preset():
    reader = Reader(gzip.decompress((EASY_NPC / "preset/humanoid/market.npc.nbt").read_bytes()))
    root_kind, root_name = reader.unpack("b"), reader.string()
    tags = reader.payload(root_kind)

    # npcInteraction.js identifies an NPC by the dialog.npc.<id>.name key in its name
    tags["CustomName"] = (8, '{"color":"#FFFFFF","translate":"dialog.npc.%s.name"}' % NPC)
    tags["SkinData"][1]["UUID"] = (11, name_uuid(f"{NPC}.png"))
    tags["UUID"] = (11, name_uuid(f"sunlitweed:{NPC}:entity"))
    tags["PresetUUID"] = (11, name_uuid(f"sunlitweed:{NPC}:preset"))

    out = EASY_NPC_OUT / f"preset/humanoid/{NPC}.npc.nbt"
    out.parent.mkdir(parents=True, exist_ok=True)
    raw = struct.pack(">b", root_kind) + write_string(root_name) + write_payload(root_kind, tags)
    out.write_bytes(gzip.compress(raw, mtime=0))
    print("wrote", out.relative_to(ROOT))


# --- Art ---
SHADE_FRAME = (22, 22, 26, 255)
SHADE_LENS = (38, 42, 52, 255)
SHADE_SHINE = (128, 140, 162, 255)


def white_suit(pixel):
    """Orange jacket/sweater -> white linen suit. Skin, hair, scarf and strap are left alone."""
    r, g, b, a = pixel
    hue, light, sat = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    if a and sat > 0.45 and 0.03 < hue < 0.07 and light < 0.65:
        nr, ng, nb = colorsys.hls_to_rgb(0.11, min(0.97, 0.5 + light * 0.75), 0.18)
        return (int(nr * 255), int(ng * 255), int(nb * 255), a)
    return pixel


def paint(pixels, width, spots):
    for (x, y), colour in spots.items():
        pixels[y * width + x] = colour


def shades(lenses, bridge, shine):
    """lenses: (x0, y0, x1, y1) boxes, inclusive; bridge: pixels between them."""
    spots = {}
    for x0, y0, x1, y1 in lenses:
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                edge = x in (x0, x1) or y in (y0, y1)
                spots[(x, y)] = SHADE_FRAME if edge else SHADE_LENS
    for p in bridge:
        spots[p] = SHADE_FRAME
    for p in shine:
        spots[p] = SHADE_SHINE
    return spots


# Eye positions are the same in all five Market portraits (the head is tilted)
PORTRAIT_SHADES = shades(
    [(19, 27, 26, 31), (32, 24, 40, 28)],
    [(27, 28), (28, 28), (29, 28), (30, 27), (31, 27)],
    [(21, 28), (34, 25)],
)
SKIN_SHADES = shades([(9, 12, 10, 13), (13, 12, 14, 13)], [(11, 12), (12, 12)], [])
ICON_SHADES = shades([(5, 8, 6, 9), (9, 8, 10, 9)], [(7, 8), (8, 8)], [])


def recolour(data, spots):
    pixels, width, height = read_rgba(data)
    pixels = [white_suit(p) for p in pixels]
    paint(pixels, width, spots)
    return pixels, width, height


def write(path, image):
    write_rgba(path, *image)
    print("wrote", path.relative_to(ROOT))


EASY_NPC_OUT = ROOT / "config/easy_npc"

if __name__ == "__main__":
    build_preset()
    write(EASY_NPC_OUT / f"skin/humanoid/{NPC}.png",
          recolour((EASY_NPC / "skin/humanoid/market.png").read_bytes(), SKIN_SHADES))
    with zipfile.ZipFile(SOCIETY_JAR) as jar:
        for mood in ("", "loved/", "liked/", "disliked/", "hated/"):
            image = recolour(jar.read(f"assets/dialog/textures/portraits/{mood}market.png"), PORTRAIT_SHADES)
            write(ROOT / f"kubejs/assets/dialog/textures/portraits/{mood}{NPC}.png", image)
        icon = recolour(jar.read("assets/society/textures/item/villager_icons/market.png"), ICON_SHADES)
        write(ROOT / f"kubejs/assets/society/textures/item/villager_icons/{NPC}.png", icon)
