"""Writes The Plug's dialog files and their lang keys (stdlib only).

Dialogs go to kubejs/data/dialog/dialogs/plug_*.json, in the same shape as the pack's
generated ones, and the text to dialog.npc.plug.* keys in kubejs/assets/sunlitweed/lang/en_us.json.
Edit the lines below and re-run. If the number of chatter or gift dialogs changes, update
dialogLengths in kubejs/server_scripts/sunlitweed/plugNpc.js (this script prints them).
"@i" is replaced with the player's name.
Usage: python tools/gen_plug_dialog.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIALOGS = ROOT / "kubejs/data/dialog/dialogs"
LANG = ROOT / "kubejs/assets/sunlitweed/lang/en_us.json"
NPC = "plug"
NAME = "Rico"
SHOP = "The Plug"

INTRO = [
    "Easy, easy. No need to stare, @i. I'm just a businessman.",
    "Import, export. Agricultural products, mostly. Very green, very natural.",
    "You've got farmland and you've got Create machines. I've got seeds and know-how.",
    "Come by any time. Just... don't mention me to the Banker.",
]

# One list per heart level (0-5), each entry is one dialog. The shop opens after the last line.
CHATTER = [
    [
        ["You again? Fine. Keep your voice down."],
        ["Coca likes it hot. Summer and autumn, on watered farmland.", "Don't ask me how I know."],
        ["The Mayor asked what I do for a living.", "I said 'consulting'. Nobody asks follow-up questions about consulting."],
    ],
    [
        ["Lime, @i. Crushed limestone. Without it the leaves are just tea."],
        ["Four leaves, one lime, some water. Let a mixer do the stirring.", "Your arms will thank you."],
        ["I tried selling at the market once.", "Leon called the guards on my folding table."],
    ],
    [
        ["Dry the paste with a fan blowing through lava.", "Don't stand in front of it. Learned that one the hard way."],
        ["You're quieter than most people around here. I like that."],
        ["Business is good. Too good. I've started laundering money through the Fish Pond."],
    ],
    [
        ["The press packs four bags of powder into a brick.", "Neat, stackable, and it ships well."],
        ["Between you and me, I came here for the weather.", "And the lack of extradition treaties."],
        ["Careful with the lines, @i.", "Five minutes of feeling like a Rapidash, then you're staring at the ceiling all night."],
    ],
    [
        ["You know, I don't let many people see the books.", "...I don't keep books. That's the point."],
        ["Got some fresh stock in. Friends' prices, for you."],
        ["The Shady Trader is a cousin of mine. Twice removed.", "He keeps getting removed, actually."],
    ],
    [
        ["@i! My favourite business partner!", "Sit, sit. Can I get you anything? Anything at all?"],
        ["If anyone asks, we've never met.", "But between us? You're family now."],
        ["When I retire, the whole operation goes to you.", "Don't tell my cousin."],
    ],
]

GIFTS = {
    "loved": [
        ["Now THIS is quality product.", "You've got a real future in this business, @i."],
        ["*sniff* Oh, that's the good stuff.", "I owe you one. A big one."],
    ],
    "liked": [
        ["Hey, not bad! I'll save this for after work.", "Whenever that is."],
        ["Thoughtful. I'll remember this."],
    ],
    "neutral": [
        ["Huh. Thanks, I guess.", "I'll put it with the other... evidence."],
        ["A gift? For me? What do you want?"],
    ],
    "disliked": [
        ["What am I supposed to do with this?", "Sell it? Nobody's buying."],
        ["I'll pretend you didn't give me this."],
    ],
    "hated": [
        ["Are you trying to get me arrested?", "Get that away from me."],
        ["This is an insult to my whole family, @i."],
    ],
}

FIVE_GIFT = [
    "Listen, @i. In my line of work, trust is everything.",
    "And you? You've earned it.",
    "Take these. Fresh off the press, my personal reserve.",
    "Don't spend them all in one place. Actually, do. Spread them around, it's less suspicious.",
]

MYSTERY_GIFT = [
    "This little one followed me home from the jungle.",
    "It hates crowds, it hates cops, and it likes you.",
    "Look after it, @i.",
]


def entry(i, count, key, portrait, last_command=None):
    ident = "start" if i == 0 else ("end" if i == count - 1 else i)
    e = {
        "id": ident,
        "speaker": {"translate": f"dialog.npc.{NPC}.name", "color": "white"},
        "text": [{"translate": f"{key}.line_{i}"}],
        "portraits": [{"path": portrait, "position": "INLINE", "brightness": 1}],
    }
    if last_command and i == count - 1:
        e["command"] = [last_command]
    return e


def dialog(dialog_id, title, description, key, lines, portrait=f"{NPC}.png", last_command=None, allow_close=False):
    lang[f"{key}.description"] = description
    for i, line in enumerate(lines):
        lang[f"{key}.line_{i}"] = line
    data = {"id": dialog_id, "title": title, "description": f"{key}.description"}
    if allow_close:
        data["allowClose"] = True
    data["entries"] = [entry(i, len(lines), key, portrait, last_command) for i in range(len(lines))]
    (DIALOGS / f"{dialog_id}.json").write_text(json.dumps(data, indent="\t", ensure_ascii=False) + "\n", encoding="utf-8")


if __name__ == "__main__":
    DIALOGS.mkdir(parents=True, exist_ok=True)
    for old in DIALOGS.glob(f"{NPC}_*.json"):
        old.unlink()
    all_lang = json.loads(LANG.read_text(encoding="utf-8"))
    all_lang = {k: v for k, v in all_lang.items() if not k.startswith(f"dialog.npc.{NPC}.")}
    lang = {f"dialog.npc.{NPC}.name": NAME, f"shop.society_trading.{NPC}": SHOP}

    dialog(f"{NPC}_intro", f"{NPC} introduction", "Introduction", f"dialog.npc.{NPC}.intro.0", INTRO)
    for hearts, dialogs in enumerate(CHATTER):
        for n, lines in enumerate(dialogs):
            dialog(f"{NPC}_chatter_friendship{hearts}_{n}", f"[{n}] {NPC} chatter at friendship{hearts}", "Chatter",
                   f"dialog.npc.{NPC}.chatter_friendship{hearts}.{n}", lines,
                   last_command=f"openshop @p {NPC}", allow_close=True)
    for value, dialogs in GIFTS.items():
        portrait = f"{NPC}.png" if value == "neutral" else f"{value}/{NPC}.png"
        for n, lines in enumerate(dialogs):
            dialog(f"{NPC}_gift_{value}_{n}", f"{NPC} {value} gift", "Gift",
                   f"dialog.npc.{NPC}.gift_{value}.{n}", lines, portrait)
    dialog(f"{NPC}_unique_five_gift", f"{NPC} five hearts", "Five hearts",
           f"dialog.npc.{NPC}.unique_five_gift", FIVE_GIFT)
    dialog(f"{NPC}_unique_cobblemon_mystery_gift", f"{NPC} mystery gift", "Mystery gift",
           f"dialog.npc.{NPC}.unique_cobblemon_mystery_gift", MYSTERY_GIFT)

    all_lang.update(lang)
    LANG.write_text(json.dumps(all_lang, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote {len(list(DIALOGS.glob(f'{NPC}_*.json')))} dialogs and {len(lang)} lang keys")
    print("chatterLengths:", [len(d) for d in CHATTER])
    print("giftResponseLengths:", {k: len(v) for k, v in GIFTS.items()})
