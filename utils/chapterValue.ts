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
  let holes = chapters.map((c, i) => (!c.value ? i : null)).filter((v) => v);
  let holeRanges = holes.reduce((ranges, current, index, array) => {
    let lastRange = ranges[ranges.length - 1];
    if (lastRange && current === lastRange[1] + 1) lastRange[1] = current;
    else ranges.push([current!, current!]);
    return ranges;
  }, [] as number[][]);

  for (let range of holeRanges) {
    let [start, stop] = range;
    let distance = stop - start + 1;
    let before = chapters[start - 1].value;
    let after = chapters[start + 1].value;
    let k = (before - after) / distance;
    for (let i = start; i < stop + 1; i++) {
      chapters[i].value = before + k * i;
    }
  }

  return chapters;
}
