import { plural } from '@lingui/macro';

const units = [null, 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

export function getHumanSize(x) {
  let l = 0,
    n = parseInt(x, 10) || 0;

  while (n >= 1024) {
    l++;
    n /= 1024;
  }

  if (l === 0) {
    return plural(n, {
      one: '# byte',
      other: '# bytes',
    });
  }

  return n.toFixed(n < 10 ? 1 : 0) + ' ' + units[l];
}
