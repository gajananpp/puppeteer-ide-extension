export const getElementSelector = function (el: HTMLElement): string {
  if (el.tagName.toLowerCase() === 'html') return 'html';
  let str = el.tagName.toLowerCase();
  str += el.id !== '' ? '#' + el.id : '';
  if (el.className) {
    const classes = el.className.trim().split(/\s/);
    for (let i = 0; i < classes.length; i++) {
      str += '.' + classes[i];
    }
  }
  return getElementSelector(<HTMLElement>el.parentNode) + ' > ' + str;
};
