function chapterValue(chap: string) {
  let val = null;
  let match = chap.match(/.*?(\d+)[^\d]*.*/);
  if (match) val = match[1];
  return val ? parseInt(val) : null;
}

export default function mergeChapterList(lists: APIChapter[][]) {
  return lists.reduce((v, c) => [...v, ...c], []);
  // if (lists.length < 1) return [];
  // let d: [string, number | null][] = lists[0].map((c) => [c, chapterValue(c)]);
  // for (let li = 1; li < lists.length; li++) {
  //   let list: [string, number | null][] = lists[li].map((c) => [
  //     c,
  //     chapterValue(c),
  //   ]);
  //   for (let i = 0; i < list.length; i++) {
  //     let curr = list[i];
  //     if (!d.some((el) => el[0] == curr[0])) {
  //       if (curr[1] == null) {
  //         let next = list.findLastIndex((el, i2) => i2 < i && el[1] != null);
  //         if (next != -1) {
  //           let k = list[next]![1]!;
  //           d.splice(k, 0, curr);
  //         } else d.push(curr);
  //       } else {
  //         let k = d.findLastIndex((other) => {
  //           if (other[1] != null) return other[1] <= curr[1]!;
  //         });
  //         d.splice(k, 0, curr);
  //       }
  //     }
  //   }
  // }
  // return d.map((el) => el[0]);
}
