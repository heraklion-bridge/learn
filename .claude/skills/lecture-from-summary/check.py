#!/usr/bin/env python3
"""Automatic checks for a unit built by the lecture-from-summary skill.

Usage (from the repository root):  python3 .claude/skills/lecture-from-summary/check.py <slug> [<slug> ...]
Example:                           python3 .claude/skills/lecture-from-summary/check.py epilogi-symvolaiou

It reads lectures/<slug>/index.html, quiz/<slug>/index.html, quiz/<slug>/questions.js, the cycle list pages
(lectures/a-kyklos/index.html, quiz/a-kyklos/index.html) and the sidebar data in assets/site.js,
and prints PASS / FAIL lines. Exit code 1 if anything fails. It does not replace looking at the slides.
"""
import os
import re
import sys

ROOT = os.getcwd()


def read(path):
    with open(os.path.join(ROOT, path), encoding='utf-8') as f:
        return f.read()


def text_of(html):
    """Visible-ish text: drop tags, keep suit symbols (the red-suit spans disappear)."""
    return re.sub(r'<[^>]+>', '', html)


FAILS = []


def report(ok, name, detail=''):
    print(('PASS  ' if ok else 'FAIL  ') + name + (('  -> ' + detail) if detail else ''))
    if not ok:
        FAILS.append(name)


def find(pattern, s, flags=0, limit=6):
    out = []
    for m in re.finditer(pattern, s, flags):
        a = max(0, m.start() - 25)
        out.append(s[a:m.end() + 25].replace('\n', ' '))
        if len(out) >= limit:
            break
    return out


def check_unit(slug):
    print('\n=== unit: %s ===' % slug)
    files = {
        'deck': 'lectures/%s/index.html' % slug,
        'quiz page': 'quiz/%s/index.html' % slug,
        'questions': 'quiz/%s/questions.js' % slug,
    }
    missing = [p for p in files.values() if not os.path.exists(os.path.join(ROOT, p))]
    if missing:
        report(False, 'files exist', ', '.join(missing))
        return
    report(True, 'files exist')

    src = {k: read(p) for k, p in files.items()}
    txt = {k: text_of(v) for k, v in src.items()}
    whole = '\n'.join(txt.values())

    # 1. forbidden strings (the teacher's requests: no name, no lesson numbers)
    bad = find(r'[Μμ]άθημα\s*\d|μαθήματος\s*\d|Α΄\s*κύκλ|Φλουρ|Flouris|Flooris', whole)
    report(not bad, 'no teacher name / lesson numbers / cycle labels', ' | '.join(bad))

    # 2. ΧΑ typed with Greek letters only
    bad = find(r'(?<![A-Za-zΑ-Ωα-ω])(?:XA|ΧA|XΑ)(?![A-Za-zΑ-Ωα-ω])', whole)
    report(not bad, 'ΧΑ written with Greek letters', ' | '.join(bad))

    # 3. Greek grammar of bids and of μανς / λεβέ / αντάμ
    g = []
    for name, pat in [
        ('singular article before a level 2-7 bid', r'\b(?:[Ηη]|[Τ]ην|τη[ν]?|της)\s+[2-7]\s?(?:♣|♦|♠|♥|ΧΑ)'),
        ('"το/του" before a level 2-7 bid (use οι / τα / τις)', r'\b(?:[Τ]ο|το|του|τον)\s+[2-7]\s?(?:♣|♦|♠|♥|ΧΑ)'),
        ('οι/τις before clubs/diamonds (σπαθιά, καρά are τα)', r'\b(?:[Οο]ι|τις)\s+[2-7]\s?(?:♣|♦)'),
        ('τα before hearts/spades (κούπες, πίκες are οι)', r'\b(?:[Τ]α|τα)\s+[2-7]\s?(?:♥|♠)'),
        ('μανς is feminine (η μανς)', r'\b(?:[Τ]ο|το|του|τον|ένα|ίδιο)\s+(?:[α-ωά-ώ]+\s+)?μανς'),
        ('πόντοι is masculine (οι 16 πόντοι)', r'(?<![Α-Ωα-ωά-ώ])[Τ]?τα\s+\d+\s+πόντοι'),
        ('λεβέ / αντάμ with a neuter article', r'\b(?:το|του|τα|ένα|τον)\s+(?:[α-ωά-ώ]+\s+)?(?:λεβέ|αντάμ)'),
    ]:
        hits = find(pat, whole)
        if hits:
            g.append('%s: %s' % (name, ' | '.join(hits[:3])))
    report(not g, 'grammar patterns (article of bids, η μανς, η λεβέ, η αντάμ)', ' || '.join(g))

    # 4. relative links and assets resolve
    broken = []
    for k in ('deck', 'quiz page'):
        base = os.path.dirname(files[k])
        for h in re.findall(r'(?:href|src)="([^"#?]+)', src[k]):
            if re.match(r'(https?:|mailto:|tel:|data:|//)', h):
                continue
            t = os.path.normpath(os.path.join(ROOT, base, h))
            if os.path.isdir(t):
                t = os.path.join(t, 'index.html')
            if not os.path.exists(t):
                broken.append('%s -> %s' % (k, h))
    report(not broken, 'relative links resolve', ', '.join(broken))

    # 5. unit number appears consistently
    m = re.search(r'<title>Ενότητα (\d\d) ·', src['deck'])
    n = m.group(1) if m else None
    report(bool(n), 'deck <title> starts with «Ενότητα NN ·»')
    if n:
        report(('Ενότητα %s ·' % n) in txt['deck'], 'title slide shows «Ενότητα %s ·»' % n)
        report(bool(re.search(r'<h1>Κουίζ %s:' % n, src['quiz page'])), 'quiz <h1> is «Κουίζ %s: …»' % n)
        report(bool(re.search(r'<title>Κουίζ %s:' % n, src['quiz page'])), 'quiz <title> is «Κουίζ %s: …»' % n)

    # 6. counts: slides and questions agree with the tiles and the last slide
    slides = len(re.findall(r'<section', src['deck']))
    questions = len(re.findall(r'^    \{', src['questions'], re.M))
    li = read('lectures/a-kyklos/index.html')
    qi = read('quiz/a-kyklos/index.html')
    row = r'<a class="res" href="\.\./%s/">(?:(?!</a>).)*?(\d+) %s'
    tile_l = re.search(row % (re.escape(slug), 'διαφάνειες'), li, re.S)
    tile_q = re.search(row % (re.escape(slug), 'ερωτήσεις'), qi, re.S)
    report(bool(tile_l) and int(tile_l.group(1)) == slides, 'lectures/a-kyklos/index.html row says %d slides' % slides,
           'row: %s' % (tile_l.group(1) if tile_l else 'missing'))
    report(bool(tile_q) and int(tile_q.group(1)) == questions, 'quiz/a-kyklos/index.html row says %d questions' % questions,
           'row: %s' % (tile_q.group(1) if tile_q else 'missing'))
    report(("slug: '%s'" % slug) in read('assets/site.js'), "assets/site.js lists the unit in SITE.cycles (sidebar and search)")
    last = re.search(r'(\d+) ερωτήσεις', src['deck'])
    report(bool(last) and int(last.group(1)) == questions, 'last slide says %d questions' % questions,
           'slide: %s' % (last.group(1) if last else 'missing'))

    # 7. sitemap, quiz structure
    sm = read('sitemap.xml')
    for kind in ('lectures', 'quiz'):
        report('/%s/%s/' % (kind, slug) in sm, 'sitemap lists /%s/%s/' % (kind, slug))
    qs = re.findall(r'correct:\s*(\d+)', src['questions'])
    report(len(qs) == questions, 'every question has a correct answer', '%d questions, %d correct' % (questions, len(qs)))
    report(18 <= questions <= 21, 'question count is 18-21', str(questions))
    report('next:' not in src['questions'], 'questions.js has no next: entry (quizzes do not link to the next quiz)')

    # 8. minimal end-of-unit links: last slide = quiz + back to the list; quiz page has no extra note
    btns = re.findall(r'<a class="btnlink[^"]*" href="([^"]+)"', src['deck'])
    report(sorted(btns) == sorted(['../../quiz/%s/' % slug, '../a-kyklos/']), 'last slide has only the quiz button and the back button', ', '.join(btns))
    report('quiz-note' not in src['quiz page'], 'quiz page has no quiz-note paragraph with extra links')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    for s in sys.argv[1:]:
        check_unit(s)
    print('\n%s' % ('ALL CHECKS PASSED' if not FAILS else '%d CHECK(S) FAILED' % len(FAILS)))
    sys.exit(1 if FAILS else 0)
