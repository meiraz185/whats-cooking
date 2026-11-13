"""Real-browser tests for WHAT'S COOKING? V2.1 (Playwright + Chromium).
Run from whats-cooking/v2:  python3 -m http.server 8767 &   then   python3 tests/ui_test.py
Each check drives the real page with mouse or touch input and then reads the game state."""
import asyncio, json, os, sys, math
from playwright.async_api import async_playwright

URL = os.environ.get('WC_URL', 'http://localhost:8767/index.html')
CHROME = os.environ.get('WC_CHROME', '/usr/bin/google-chrome')
SHOTS = os.environ.get('WC_SHOTS', '/tmp/wc21_shots')
os.makedirs(SHOTS, exist_ok=True)
results = []

def check(name, ok, detail=''):
    results.append({'test': name, 'pass': bool(ok), 'detail': str(detail)})
    print(('PASS ' if ok else 'FAIL ') + name + (' — ' + str(detail) if detail != '' else ''))

async def ev(pg, js): return await pg.evaluate(js)
async def center(pg, sel):
    await ev(pg, f"(()=>{{const e=document.querySelector('{sel}'); if(e && e.closest('.shelf')) e.scrollIntoView({{inline:'center',block:'nearest'}})}})()")
    b = await pg.locator(sel).first.bounding_box()
    return b['x'] + b['width'] / 2, b['y'] + b['height'] / 2
async def svgc(pg, sel):  # centre of an svg control's first circle (knobs, eggs)
    return await ev(pg, f"(()=>{{const e=document.querySelector('{sel}');const c=e.querySelector('circle')||e;const r=c.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}})()")
async def uid(pg, ing): return await ev(pg, f"(WC.State.byId('{ing}')||{{}}).uid")
async def served(pg): return await ev(pg, "WC.State.st.served && WC.State.st.served.outcome")

async def click(pg, sel, wait=120):
    x, y = await center(pg, sel); await pg.mouse.click(x, y); await pg.wait_for_timeout(wait)
async def clickxy(pg, xy, wait=150):
    await pg.mouse.click(*xy); await pg.wait_for_timeout(wait)
async def mdrag(pg, src, dst, steps=14):
    x0, y0 = await center(pg, src); x1, y1 = await center(pg, dst)
    await pg.mouse.move(x0, y0); await pg.mouse.down()
    for i in range(1, steps + 1):
        # lift vertically first so a shelf drag isn't read as horizontal scrolling
        t = i / steps
        await pg.mouse.move(x0 + (x1 - x0) * (t ** 2), y0 + (y1 - y0) * t); await pg.wait_for_timeout(12)
    await pg.mouse.up(); await pg.wait_for_timeout(220)
async def mcircle(pg, sel, turns=2.5, r=60):
    cx, cy = await center(pg, sel); cy -= 10
    await pg.mouse.move(cx + r, cy); await pg.mouse.down()
    for i in range(1, int(36 * turns) + 1):
        a = i / 36 * 2 * math.pi
        await pg.mouse.move(cx + r * math.cos(a), cy + r * math.sin(a)); await pg.wait_for_timeout(8)
    await pg.mouse.up(); await pg.wait_for_timeout(150)

# touch via CDP
async def ttap(cdp, pg, sel=None, xy=None):
    x, y = xy if xy else await center(pg, sel)
    await cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x, 'y': y}]}); await pg.wait_for_timeout(40)
    await cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []}); await pg.wait_for_timeout(170)
async def tdrag(cdp, pg, src, dst, steps=14):
    x0, y0 = await center(pg, src); x1, y1 = await center(pg, dst)
    await cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x0, 'y': y0}]})
    for i in range(1, steps + 1):
        t = i / steps
        await cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': x0 + (x1 - x0) * (t ** 3), 'y': y0 + (y1 - y0) * t}]}); await pg.wait_for_timeout(16)
    await cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []}); await pg.wait_for_timeout(220)
async def tswipe(cdp, pg, sel, n=24):
    x, y = await center(pg, sel)
    await cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x - 40, 'y': y}]})
    for i in range(n):
        await cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': x - 40 + (i % 8) * 10, 'y': y + (i // 8) * 6}]}); await pg.wait_for_timeout(10)
    await cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []}); await pg.wait_for_timeout(150)
async def tcircle(cdp, pg, sel, turns=2.6, r=45):
    cx, cy = await center(pg, sel); cy -= 8
    await cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': cx + r, 'y': cy}]})
    for i in range(1, int(36 * turns) + 1):
        a = i / 36 * 2 * math.pi
        await cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': cx + r * math.cos(a), 'y': cy + r * math.sin(a)}]}); await pg.wait_for_timeout(8)
    await cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []}); await pg.wait_for_timeout(150)

async def serve_ui(pg, method, how='drag'):
    """Move the cooked food to the plate the way a player would: open the oven if needed, then drag (or tap) the ladle/tray."""
    if method == 'oven' and not await ev(pg, "WC.State.st.door"):
        await clickxy(pg, await svgc(pg, '#st-oven .oven-door'))
    await pg.wait_for_timeout(150)
    if how == 'drag':
        await mdrag(pg, '[data-serve]', '#st-serve', 16)
    else:
        await clickxy(pg, await svgc(pg, '[data-serve]'))
        await click(pg, '#st-serve')
    await pg.wait_for_timeout(2300)

async def fresh(pg):
    await ev(pg, "WC.Result.hide(); WC.Book.close(); WC.Game.newRound()"); await pg.wait_for_timeout(120)

async def cook_ui(pg, method, picks, crack=False, stir=0, wait=4000, shot=None, chop=()):
    """Pick from the cabinet by tapping, then drag each pick from the counter into the station."""
    await fresh(pg)
    for ing in picks: await click(pg, f'[data-pick="{ing}"]')
    for ing in picks:
        if ing in chop:
            await mdrag(pg, f'#st-counter [data-uid="{await uid(pg, ing)}"]', '#st-board')
            for _ in range(3): await click(pg, '#st-board', 140)
            await mdrag(pg, f'#st-board [data-uid="{await uid(pg, ing)}"]', f'#st-{method}')
            continue
        await mdrag(pg, f'#st-counter [data-uid="{await uid(pg, ing)}"]', f'#st-{method}')
        if ing == 'egg' and crack: await clickxy(pg, await svgc(pg, f'#st-{method} .rim-egg'))
    if stir: await mcircle(pg, f'#st-{method}', stir)
    await clickxy(pg, await svgc(pg, f'#st-{method} .knob'))
    await pg.wait_for_timeout(wait)
    if shot: await pg.screenshot(path=f'{SHOTS}/{shot}_cooking.png')
    await serve_ui(pg, method, 'drag' if method == 'pot' else 'tap')
    if shot: await pg.screenshot(path=f'{SHOTS}/{shot}_result.png')
    return await served(pg), await ev(pg, "document.getElementById('res-name').textContent"), await ev(pg, "document.querySelector('#res-stage svg') ? document.querySelector('#res-stage svg').dataset.dish : null")

async def desktop(b):
    ctx = await b.new_context(viewport={'width': 1366, 'height': 820})
    pg = await ctx.new_page()
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    await pg.goto(URL); await pg.wait_for_timeout(400)
    await ev(pg, "localStorage.clear()"); await pg.reload(); await pg.wait_for_timeout(500)
    await pg.screenshot(path=f'{SHOTS}/01_desktop_start.png')

    n = await ev(pg, "document.querySelectorAll('#st-cabinet [data-pick]').length")
    names = await ev(pg, "[...document.querySelectorAll('#st-cabinet [data-pick] span')].map(s=>s.textContent)")
    check('All ingredients appear in the cabinet (42, no duplicates)', n == 42 and len(set(names)) == 42, f'{n} shown')
    cats = await ev(pg, "[...document.querySelectorAll('.shelf-group')].map(g=>[g.dataset.cat, g.querySelectorAll('[data-pick]').length, getComputedStyle(g.querySelector('.shelf-items')).gridTemplateColumns.split(' ').length])")
    check('Every cabinet category is filled (even counts → two full shelf rows, no gaps)', all(c[1] >= 8 and c[1] % 2 == 0 and c[2] * 2 == c[1] for c in cats), cats)
    lay = await ev(pg, "['cabinet','counter','board','pot','oven','serve'].map(n=>Math.round(document.getElementById('st-'+n).getBoundingClientRect().top))")
    check('Layout order: cabinet → picks & board → pot & oven → serving plate at the very bottom', lay[0] < lay[1] == lay[2] < lay[3] == lay[4] < lay[5] and not await ev(pg, "!!document.querySelector('#st-board ~ #st-plate, #st-counter #st-plate, #st-plate')"), lay)
    prep = await ev(pg, "[...document.querySelectorAll('#st-counter .slot')].length===4 && !document.querySelector('#st-board .serve-label, #st-counter .serve-label')")
    check('Preparation area holds only the 4 slots, the board and the knife', prep and await ev(pg, "!!document.querySelector('#st-board .knife')"))
    check('The cabinet is at the top of the kitchen', await ev(pg, "document.getElementById('st-cabinet').getBoundingClientRect().top < document.getElementById('st-counter').getBoundingClientRect().top"))
    grater = await ev(pg, "!!document.querySelector('#st-grater,[data-drop=grater],.grater') || /grat/i.test(document.body.innerText) || !!(WC.PREP.grate) || typeof WC.State.grate==='function'")
    check('The grater is completely gone (DOM, text, engine)', not grater)
    check('Two cooking stations only: pot + oven', await ev(pg, "!document.getElementById('st-pan') && !document.getElementById('st-bowl') && !!document.getElementById('st-pot') && !!document.getElementById('st-oven')"))
    check('Plate starts empty and inactive', await ev(pg, "!document.querySelector('#st-serve .serveable') && !document.querySelector('#st-serve .dish')"))

    # selection animation: the ingredient flies from the shelf into a slot and settles
    await pg.mouse.click(*(await center(pg, '[data-pick="carrot"]')))
    await pg.wait_for_timeout(120)
    flying = await ev(pg, "document.querySelectorAll('.flyer').length")
    await pg.wait_for_timeout(500)
    settled = await ev(pg, "!!document.querySelector('#st-counter .item.settle') && !document.querySelector('.flyer')")
    check('Picking animates: the ingredient flies to its slot, then settles', flying == 1 and settled, f'flyer={flying} settled={settled}')
    await click(pg, '[data-pick="carrot"]')
    # every ingredient can be selected (tap), then deselected (tap again)
    ok_all = True; bad = []
    for ing in await ev(pg, "WC.ING_ORDER"):
        await click(pg, f'[data-pick="{ing}"]', 60)
        on = await ev(pg, f"!!WC.State.byId('{ing}') && document.querySelector('[data-pick=\"{ing}\"]').classList.contains('picked')")
        await click(pg, f'[data-pick="{ing}"]', 60)
        off = await ev(pg, f"!WC.State.byId('{ing}')")
        if not (on and off): ok_all = False; bad.append(ing)
    check('Every ingredient can be selected and deselected by tapping it in the cabinet', ok_all, bad)
    for ing in ['tomato', 'egg', 'cheese', 'onion', 'pasta']:
        await click(pg, f'[data-pick="{ing}"]')
    cnt = await ev(pg, "WC.State.count()"); toast = await ev(pg, "document.getElementById('toast').textContent")
    label = await ev(pg, "document.querySelector('.cab-count').textContent")
    await pg.screenshot(path=f'{SHOTS}/02_four_picked.png')
    check('No more than four can be selected (5th refused, selection shown "4/4 picked")', cnt == 4 and 'limit' in toast.lower() and '4/4' in label, f'{cnt} {label}')
    await pg.wait_for_timeout(500)
    await click(pg, '#st-counter [data-act="unpick:onion"]')
    await click(pg, '[data-pick="pasta"]')
    check('Replace: × on a pick puts it back, then another can be chosen', await ev(pg, "!WC.State.byId('onion') && !!WC.State.byId('pasta') && WC.State.count()===4"))

    # cutting board: only cuttable things
    await mdrag(pg, f'#st-counter [data-uid="{await uid(pg, "pasta")}"]', '#st-board')
    pasta_loc = await ev(pg, "WC.State.byId('pasta').loc")
    await mdrag(pg, f'#st-counter [data-uid="{await uid(pg, "tomato")}"]', '#st-board')
    for _ in range(3): await click(pg, '#st-board', 160)
    tst = await ev(pg, "WC.State.byId('tomato').state")
    await pg.screenshot(path=f'{SHOTS}/03_chopped.png')
    check('Cutting board works (tap ×3 → chopped tomato)', tst == 'chopped', tst)
    check('Only appropriate ingredients can be cut (pasta refused by the board)', pasta_loc == 'counter', pasta_loc)
    cuttable = await ev(pg, "WC.ING_ORDER.filter(i=>WC.canChop(i,WC.INGREDIENTS[i].start))")
    check('Cuttable list is logical', set(['tomato', 'onion', 'mushroom', 'carrot', 'zucchini', 'pepper', 'potato', 'strawberry', 'banana', 'apple']) <= set(cuttable) and 'pasta' not in cuttable and 'milk' not in cuttable and 'sugar' not in cuttable and 'flour' not in cuttable, cuttable)

    # pot: tomato in, wait for it to cook, egg on rim → tap to crack (shakshuka)
    await mdrag(pg, f'#st-board [data-uid="{await uid(pg, "tomato")}"]', '#st-pot')
    vis = await ev(pg, f"!!document.querySelector('#st-pot [data-uid=\"{await uid(pg, 'tomato')}\"]')")
    check('Ingredients visually enter the chosen station (tomato drawn in the pot)', vis)
    await clickxy(pg, await svgc(pg, '#st-pot .knob'))
    lit = await ev(pg, "WC.State.st.heat.pot")
    await pg.wait_for_timeout(1600)
    flames = await ev(pg, "document.querySelectorAll('#st-pot .flame').length")
    await pg.wait_for_timeout(2000)
    bubbles = await ev(pg, "document.querySelectorAll('#st-pot .bub').length")
    await mdrag(pg, f'#st-counter [data-uid="{await uid(pg, "egg")}"]', '#st-pot')
    await clickxy(pg, await svgc(pg, '#st-pot .rim-egg'))
    fell = await ev(pg, "!!document.querySelector('#st-pot g.fall')")
    await pg.wait_for_timeout(900)
    bob = await ev(pg, "document.querySelectorAll('#st-pot g.bob').length")
    await pg.screenshot(path=f'{SHOTS}/04_pot_cooking.png')
    check('Pot works: stove lights, flames + bubbles animate', lit and flames > 0 and bubbles > 0, f'flames={flames} bubbles={bubbles}')
    check('Food visibly falls into the pot and gently simmers (bobbing) while cooking', fell and bob >= 2, f'fall={fell} bob={bob}')
    early = await ev(pg, "document.getElementById('result').hidden")
    tag = await ev(pg, "!!document.querySelector('#st-pot [data-serve]') && !!document.querySelector('#st-serve .serveable')")
    check('When ready, the pot offers a ladle and the plate lights up (no reveal yet)', early and tag)
    x0, y0 = await svgc(pg, '[data-serve]'); x1, y1 = await center(pg, '#st-serve')
    await pg.mouse.move(x0, y0); await pg.mouse.down()
    for i in range(1, 17): await pg.mouse.move(x0 + (x1 - x0) * i / 16, y0 + (y1 - y0) * i / 16); await pg.wait_for_timeout(12)
    await pg.mouse.up(); await pg.wait_for_timeout(250)
    fly = await ev(pg, "document.querySelectorAll('.flyer .dish').length")
    hidden_during = await ev(pg, "document.getElementById('result').hidden")
    await pg.wait_for_timeout(800)
    plated = await ev(pg, "!!document.querySelector('#st-serve .dish')")
    await pg.screenshot(path=f'{SHOTS}/05a_plated.png')
    await pg.wait_for_timeout(1300)
    o = await served(pg)
    await pg.screenshot(path=f'{SHOTS}/05_shakshuka.png')
    check('Serving: the dish travels from the pot to the plate, settles, THEN the reveal shows', fly == 1 and hidden_during and plated and not await ev(pg, "document.getElementById('result').hidden"), f'fly={fly} plated={plated}')
    check('Final dish reveal works (Shakshuka from tomato cooked first, then egg)', o == 'shakshuka', o)

    # oven: open/close door, place, stir tray, bake, watch through window, take out
    await fresh(pg)
    await clickxy(pg, await svgc(pg, '#st-oven .oven-door'))
    opened = await ev(pg, "WC.State.st.door")
    await clickxy(pg, await svgc(pg, '#st-oven .oven-door'))
    closed = not await ev(pg, "WC.State.st.door")
    check('Oven door opens and closes on tap', opened and closed)
    for ing in ['flour', 'milk', 'chocolate', 'banana']: await click(pg, f'[data-pick="{ing}"]')
    await mdrag(pg, f'#st-counter [data-uid="{await uid(pg, "flour")}"]', '#st-oven')
    auto_open = await ev(pg, "WC.State.st.door")
    for ing in ['milk', 'chocolate', 'banana']: await mdrag(pg, f'#st-counter [data-uid="{await uid(pg, ing)}"]', '#st-oven')
    await pg.screenshot(path=f'{SHOTS}/06_oven_open_tray.png')
    await mcircle(pg, '#st-oven', 2.6)
    mixed = await ev(pg, "WC.State.st.mixed.oven")
    await clickxy(pg, await svgc(pg, '#st-oven .knob'))
    baking = await ev(pg, "WC.State.cooking('oven') && !WC.State.st.door")
    await pg.wait_for_timeout(2500)
    await pg.screenshot(path=f'{SHOTS}/07_oven_baking.png')
    glow = await ev(pg, "!!document.querySelector('#st-oven .glow')")
    t1 = await ev(pg, "WC.State.byId('flour').cookT")
    await clickxy(pg, await svgc(pg, '#st-oven .oven-door')); await pg.wait_for_timeout(800)
    t2 = await ev(pg, "WC.State.byId('flour').cookT")
    await clickxy(pg, await svgc(pg, '#st-oven .oven-door'))
    await pg.wait_for_timeout(1600)
    check('Oven works: tray reachable with door open, stirring makes batter, dial closes door and bakes, glow in window', auto_open and mixed and baking and glow, f'open={auto_open} mixed={mixed} baking={baking}')
    check('Opening the door pauses baking (genuinely interactive)', abs(t2 - t1) < 0.15, f'{t1:.1f}s → {t2:.1f}s while open')
    await click(pg, '#st-serve', 300)
    refused = await served(pg) is None and await ev(pg, "document.getElementById('toast').textContent")
    light = await ev(pg, "document.querySelectorAll('#st-oven radialGradient#ovenlight').length > 0")
    await clickxy(pg, await svgc(pg, '#st-oven .oven-door')); await pg.wait_for_timeout(300)
    await pg.screenshot(path=f'{SHOTS}/07b_oven_open_ready.png')
    await mdrag(pg, '[data-serve]', '#st-serve', 16); await pg.wait_for_timeout(2300)
    o = await served(pg); nm = await ev(pg, "document.getElementById('res-name').textContent")
    await pg.screenshot(path=f'{SHOTS}/08_oven_result.png')
    check('Oven must be opened to take the dish out (closed-door serve refused with a hint); oven light on', bool(refused) and 'open' in str(refused).lower() and light, refused)
    check('Oven dish taken out → Chocolate Banana Cake', o == 'choc_cake' and nm == 'Chocolate Banana Cake', nm)

    # different methods → different outcomes (spec examples, real input)
    combos = [
        (['egg', 'cheese', 'tomato', 'onion'], True, 0, 'tomato_egg', 'egg_casserole'),
        (['pasta', 'tomato', 'cheese', 'mushroom'], False, 0, 'pasta_tomato_mush', 'pasta_bake'),
        (['flour', 'milk', 'chocolate', 'banana'], False, 2.6, 'choc_pudding', 'choc_cake'),
        (['potato', 'butter'], False, 0, None, 'baked_potato'),
        (['chicken', 'carrot', 'garlic'], False, 0, 'chicken_soup', 'roast_chicken'),
    ]
    rows = []
    allok = True
    for k, (picks, crack, stir, exp_pot, exp_oven) in enumerate(combos):
        a = await cook_ui(pg, 'pot', picks, crack, stir, shot=f'1{k}_pot')
        b2 = await cook_ui(pg, 'oven', picks, crack, stir, shot=f'1{k}_oven')
        ok = a[0] != b2[0] and a[2] != b2[2] and (exp_pot is None or a[0] == exp_pot) and b2[0] == exp_oven
        allok = allok and ok
        rows.append(f"{'+'.join(picks)}: pot → {a[1]} | oven → {b2[1]}")
    check('Different cooking methods produce different dishes & illustrations (5 real combos)', allok, ' ; '.join(rows))

    # unusual combination still produces a result
    a = await cook_ui(pg, 'pot', ['tofu', 'lemon', 'sugar'], shot='20_improv')
    check('Unusual combination still produces a named, drawn result', a[0] and a[0].startswith('imp:') and a[2], a[1])
    b2 = await cook_ui(pg, 'oven', ['apple', 'spinach', 'rice'], shot='21_improv_oven')
    check('…and its picture/name change with method and ingredients', b2[0] and b2[1] != a[1], b2[1])

    # cooking time, burn, cooking animations
    s1 = await cook_ui(pg, 'pot', ['egg'], wait=4000); s2 = await cook_ui(pg, 'pot', ['egg'], wait=6800)
    check('Cooking time changes the result (soft vs hard-boiled egg)', s1[0] == 'egg_soft' and s2[0] == 'egg_hard', f'{s1[1]} / {s2[1]}')
    p = await cook_ui(pg, 'oven', ['bread'], wait=11800, shot='22_burn')
    check('Leaving it too long burns it (Charcoal Phoenix)', p[0] == 'phoenix')

    # sound: effects fire (and mute stops output)
    await fresh(pg)
    await ev(pg, "WC.Audio.log.length=0")
    await click(pg, '[data-pick="carrot"]')
    await mdrag(pg, f'#st-counter [data-uid="{await uid(pg, "carrot")}"]', '#st-board')
    await click(pg, '#st-board', 150)
    await mdrag(pg, f'#st-board [data-uid="{await uid(pg, "carrot")}"]', '#st-pot')
    await mcircle(pg, '#st-pot', 1.2)
    await clickxy(pg, await svgc(pg, '#st-pot .knob')); await pg.wait_for_timeout(3300)
    log = await ev(pg, "WC.Audio.log.slice()")
    state = await ev(pg, "WC.Audio.ctx ? WC.Audio.ctx.state : 'none'")
    need = ['pick', 'whoosh', 'settle', 'chop', 'drop', 'splash', 'stir', 'ignite', 'ready']
    check('Sound effects fire on select (+whoosh/settle), chop, drop, splash, stir, ignite, ready (audio running)', all(x in log for x in need) and state == 'running', f'{state}; {sorted(set(log))}')
    await fresh(pg); await ev(pg, "WC.Audio.log.length=0")
    await click(pg, '[data-pick="apple"]'); await mdrag(pg, f'#st-counter [data-uid="{await uid(pg, "apple")}"]', '#st-oven')
    await clickxy(pg, await svgc(pg, '#st-oven .knob')); await pg.wait_for_timeout(3300)
    log = await ev(pg, "WC.Audio.log.slice()")
    check('Oven sounds: door open, door close, oven on, baking done', all(x in log for x in ['doorOpen', 'doorClose', 'ovenOn', 'bakeDone']), sorted(set(log)))
    v1kept = await ev(pg, "['pick','drop','crack','chop','stir','mixed','click','plop','ready','burnt','no','reveal','weird','sizzleIn','oven','ignite','ovenOn','doorOpen','doorClose','tray','bakeDone'].every(n=>WC.Audio.has(n))")
    check('All earlier (V1 + V2) sound effects are still present', v1kept)
    await click(pg, '#btn-sound')
    gain = await ev(pg, "new Promise(r=>setTimeout(()=>r(WC.Audio.master.gain.value),300))")
    pressed = await ev(pg, "document.getElementById('btn-sound').getAttribute('aria-pressed')")
    await click(pg, '#btn-sound')
    gain2 = await ev(pg, "new Promise(r=>setTimeout(()=>r(WC.Audio.master.gain.value),300))")
    check('Mute button works (master gain → 0, back on → restored)', gain < 0.01 and pressed == 'false' and gain2 > 0.3, f'{gain:.3f} / {gain2:.2f}')

    await fresh(pg); await ev(pg, "WC.Audio.log.length=0")
    a = await cook_ui(pg, 'pot', ['milk', 'chocolate'])
    log = await ev(pg, "WC.Audio.log.slice()")
    check('Serving + reveal sounds play (serve, settle, reveal)', all(x in log for x in ['serve', 'settle', 'reveal']), sorted(set(log)))
    # restart, undo, vessel lock
    await click(pg, '#res-again', 300)
    await click(pg, '[data-pick="onion"]'); await pg.wait_for_timeout(450)
    await mdrag(pg, f'#st-counter [data-uid="{await uid(pg, "onion")}"]', '#st-oven')
    before = await ev(pg, "WC.State.st.items.length===1 && WC.State.st.door")
    await click(pg, '#btn-restart')
    check('Restart (clean up) works (kitchen with food in an open oven → empty, door shut)', before and await ev(pg, "WC.State.st.items.length===0 && !WC.State.active() && !WC.State.st.door && !document.querySelector('#st-serve .dish')"))
    await click(pg, '[data-pick="milk"]'); await click(pg, '[data-pick="rice"]'); await pg.wait_for_timeout(450)
    await mdrag(pg, f'#st-counter [data-uid="{await uid(pg, "milk")}"]', '#st-pot')
    await mdrag(pg, f'#st-counter [data-uid="{await uid(pg, "rice")}"]', '#st-oven')
    check('Choosing the pot locks out the oven for that dish', await ev(pg, "WC.State.byId('rice').loc==='counter' && document.getElementById('st-oven').classList.contains('locked')"))
    await click(pg, '#btn-undo')
    check('Undo takes the last ingredient back out', await ev(pg, "WC.State.byId('milk').loc==='counter'"))

    # book
    await click(pg, '#btn-book', 300)
    await pg.screenshot(path=f'{SHOTS}/30_book.png')
    nshown = await ev(pg, "document.querySelectorAll('.book-entry:not(.locked)').length")
    check('Recipe book records discoveries incl. improvisations', nshown >= 10, nshown)
    await ev(pg, "WC.Book.close()")
    # five more complete sessions through the real interface (pot & oven, with chopping)
    sessions = [
        ('pot', ['eggplant', 'zucchini', 'tomato'], ('eggplant', 'zucchini', 'tomato'), 0, 'ratatouille'),
        ('oven', ['tortilla', 'cheese', 'chicken'], (), 0, 'quesadilla'),
        ('pot', ['noodles', 'peanut'], (), 0, 'peanut_noodles'),
        ('oven', ['oats', 'apple', 'butter'], ('apple',), 0, 'crumble'),
        ('pot', ['oats', 'milk', 'blueberries'], (), 0, 'porridge'),
        ('oven', ['flour', 'blueberries', 'milk'], (), 2.6, 'muffins'),
    ]
    got = []
    for k, (m, picks, chop, stir, exp) in enumerate(sessions):
        r = await cook_ui(pg, m, picks, stir=stir, chop=chop, shot=f'6{k}_{exp}')
        got.append((exp, r[0], r[1]))
    check('Six more complete sessions (cabinet → board → pot/oven → plate → reveal) give the right dishes', all(e == o for e, o, n in got), [f'{n}' for e, o, n in got])
    await ev(pg, "WC.Book.close()")
    check('Desktop: no page errors', not errs, errs)
    await ctx.close()

async def mobile(b):
    ctx = await b.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, device_scale_factor=2,
        user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1')
    pg = await ctx.new_page()
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    await pg.goto(URL); await pg.wait_for_timeout(500)
    cdp = await ctx.new_cdp_session(pg)
    await pg.screenshot(path=f'{SHOTS}/40_mobile_start.png')
    over = await ev(pg, "document.documentElement.scrollWidth - innerWidth"); tall = await ev(pg, "document.documentElement.scrollHeight - innerHeight")
    check('Mobile: no horizontal overflow, no page scroll', over <= 0 and tall <= 0, f'x={over} y={tall}')
    sz = await ev(pg, "(()=>{const r=document.querySelector('[data-pick=tomato]').getBoundingClientRect();return [Math.round(r.width),Math.round(r.height)]})()")
    st = await ev(pg, "['board','serve','pot','oven'].map(s=>{const r=document.getElementById('st-'+s).getBoundingClientRect();return Math.round(Math.min(r.width,r.height))})")
    check('Mobile: cabinet items and stations are touch-sized (items ≥ 60px, stations ≥ 80px)', min(sz) >= 60 and min(st) >= 80, f'item {sz}, stations {st}')
    # browse many ingredients: the shelf scrolls horizontally (native), page doesn't
    sw = await ev(pg, "(()=>{const s=document.getElementById('shelf');return [s.scrollWidth,s.clientWidth]})()")
    await ttap(cdp, pg, '[data-act="cat:sweet"]'); await pg.wait_for_timeout(600)
    sl = await ev(pg, "document.getElementById('shelf').scrollLeft")
    await pg.screenshot(path=f'{SHOTS}/41_mobile_sweet_shelf.png')
    check('Mobile: cabinet browses by compact horizontal scroll + category tabs', sw[0] > sw[1] and sl > 100, f'scrollWidth {sw}, after tab {sl}')
    # select four by touch, 5th refused, deselect by tap
    for ing in ['banana', 'chocolate', 'milk', 'flour', 'sugar']: await ttap(cdp, pg, f'[data-pick="{ing}"]')
    c = await ev(pg, "WC.State.count()")
    await ttap(cdp, pg, '[data-pick="milk"]')
    c2 = await ev(pg, "WC.State.count()")
    await ttap(cdp, pg, '[data-pick="milk"]')
    check('Mobile: tap selects up to exactly four; tapping again deselects', c == 4 and c2 == 3, f'{c} then {c2}')
    await pg.screenshot(path=f'{SHOTS}/42_mobile_picked.png')
    # cut banana by touch swipe
    await tdrag(cdp, pg, f'#st-counter [data-uid="{await uid(pg, "banana")}"]', '#st-board')
    await tswipe(cdp, pg, '#st-board')
    bs = await ev(pg, "WC.State.byId('banana').state")
    check('Mobile: cutting on a touchscreen (swipe) works', bs == 'sliced', bs)
    # choose pot by tap-select → tap pot; stir by touch circles
    for ing in ['banana', 'chocolate', 'milk', 'flour']:
        await ttap(cdp, pg, f'[data-uid="{await uid(pg, ing)}"]')
        await ttap(cdp, pg, '#st-pot')
    inpot = await ev(pg, "WC.State.inside('pot').length")
    await tcircle(cdp, pg, '#st-pot', 2.6)
    mixed = await ev(pg, "WC.State.st.mixed.pot")
    check('Mobile: tap-to-place into the pot + circular touch stirring', inpot == 4 and mixed, f'in pot {inpot}, mixed {mixed}')
    await ttap(cdp, pg, xy=await svgc(pg, '#st-pot .knob'))
    await pg.wait_for_timeout(4000)
    await pg.screenshot(path=f'{SHOTS}/43_mobile_pot.png')
    xy = await svgc(pg, '[data-serve]'); await ttap(cdp, pg, xy=xy); await ttap(cdp, pg, '#st-serve'); await pg.wait_for_timeout(2300)
    await pg.screenshot(path=f'{SHOTS}/44_mobile_result.png')
    o = await served(pg); nm = await ev(pg, "document.getElementById('res-name').textContent")
    check('Mobile: ladle tapped then plate tapped → reveal (Chocolate Banana Pudding)', o == 'choc_pudding' and 'Banana' in nm, nm)
    fits = await ev(pg, "(()=>{const r=document.querySelector('.result-card').getBoundingClientRect();return r.width<=innerWidth && r.left>=0})()")
    check('Mobile: result card fits the screen', fits)
    # oven by touch: open/close door, drag in, bake, take out
    await ev(pg, "document.getElementById('res-again').click()"); await pg.wait_for_timeout(200)
    await ttap(cdp, pg, xy=await svgc(pg, '#st-oven .oven-door'))
    op = await ev(pg, "WC.State.st.door")
    await ttap(cdp, pg, '[data-act="cat:carb"]'); await pg.wait_for_timeout(500)
    await tdrag(cdp, pg, '[data-pick="dough"]', '#st-oven')
    await ttap(cdp, pg, '[data-act="cat:veg"]'); await pg.wait_for_timeout(500)
    await tdrag(cdp, pg, '[data-pick="tomato"]', '#st-oven')
    await ttap(cdp, pg, '[data-act="cat:dairy"]'); await pg.wait_for_timeout(500)
    await tdrag(cdp, pg, '[data-pick="cheese"]', '#st-oven')
    tray = await ev(pg, "WC.State.inside('oven').length")
    await ttap(cdp, pg, xy=await svgc(pg, '#st-oven .oven-door'))
    cl = not await ev(pg, "WC.State.st.door")
    await ttap(cdp, pg, xy=await svgc(pg, '#st-oven .knob')); await pg.wait_for_timeout(4000)
    await pg.screenshot(path=f'{SHOTS}/45_mobile_oven.png')
    await ttap(cdp, pg, xy=await svgc(pg, '#st-oven .oven-door')); await pg.wait_for_timeout(300)
    await tdrag(cdp, pg, '[data-serve]', '#st-serve'); await pg.wait_for_timeout(2300)
    o = await served(pg)
    await pg.screenshot(path=f'{SHOTS}/46_mobile_pizza.png')
    check('Mobile: oven door by touch, drag from the cabinet, bake, open, drag the tray to the plate → Pizza', op and cl and tray == 3 and o == 'pizza', f'open={op} tray={tray} closed={cl} → {o}')
    await pg.set_viewport_size({'width': 844, 'height': 390}); await pg.wait_for_timeout(400)
    await ev(pg, "WC.Result.hide()"); await pg.wait_for_timeout(200)
    await pg.screenshot(path=f'{SHOTS}/47_landscape.png')
    check('Phone landscape: no horizontal overflow', await ev(pg, "document.documentElement.scrollWidth - innerWidth") <= 0)
    check('Mobile: no page errors', not errs, errs)
    await ctx.close()

async def outcomes(b):
    pg = await (await b.new_context()).new_page()
    await pg.goto(URL.replace('index.html', 'tests/gallery.html')); await pg.wait_for_timeout(800)
    g = await ev(pg, "window.GALLERY")
    bad = [x for x in g if not x['ok']]
    check(f'All {len(g)} authored outcomes reproduced in the browser engine and drawn', not bad, bad)
    await pg.screenshot(path=f'{SHOTS}/50_gallery.png', full_page=True)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME, args=['--no-sandbox', '--autoplay-policy=no-user-gesture-required'])
        await desktop(b)
        await mobile(b)
        await outcomes(b)
        await b.close()
    passed = sum(r['pass'] for r in results)
    print(f'\n{passed}/{len(results)} passed')
    with open(os.path.join(os.path.dirname(__file__), 'ui-results.json'), 'w') as f:
        json.dump(results, f, indent=1)
    sys.exit(0 if passed == len(results) else 1)

asyncio.run(main())
