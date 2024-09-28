function chapterValue(chapter: Chapter) {
  let val: null | number = null;
  let chap = chapter.chapter;
  if (chap == null) return 0;

  let k = 0;
  while (true) {
    let match = chap.match(/.*?(\d+)[^\d]*(.*)/);
    if (match) {
      chap = match[2];

      let n = Number(match[1]);
      if (k == 0) val = n;
      else val! += n / 10 ** k;
      k++;
    } else break;
  }
  return val;
}

export default function calcChapterValues(
  _chapters: Partial<Chapter>[]
): Chapter[] {
  let chapters = _chapters.map((c) => {
    let val = chapterValue(c as Chapter);
    if (val) c.value = val;
    return c;
  }) as Chapter[];

  // Fill holes
  let holes = chapters
    .map((c, i) => (c.value == undefined ? i : null))
    .filter((v) => v != undefined);

  // Handle one-shots
  if (holes.length >= 1 && holes[0] == 0) {
    if (!chapters.some((c) => c.value == 1)) chapters[0].value = 1;
    else chapters[0].value = 0;
    holes = holes.slice(1);
  }

  let holeRanges = holes.reduce((ranges, current, index, array) => {
    let lastRange = ranges[ranges.length - 1];
    if (lastRange && current === lastRange[1] + 1) lastRange[1] = current;
    else ranges.push([current!, current!]);
    return ranges;
  }, [] as number[][]);

  for (let range of holeRanges) {
    let [start, stop] = range;

    let before, after;

    if (start - 1 >= 0) before = chapters[start - 1].value;
    else before = 0;

    if (stop + 1 < chapters.length) after = chapters[stop + 1].value;
    else after = before + 1;

    let distance = after - before + 1;

    let k = (after - before) / distance;
    for (let i = 0; i < stop - start + 1; i++) {
      let val = before + k * (i + 1);
      chapters[start + i].value = val;
    }
  }

  return chapters;
}
