exports.subObj = (keys, parent) => keys.reduce((a, b) => (parent.hasOwnProperty(b) && (a[b] = parent[b]), a), {});

function getSuffix(filename) {
  const pos = filename.lastIndexOf('.');
  let suffix = '';

  if (pos !== -1) {
    suffix = filename.substring(pos);
  }
  return suffix;
}

exports.getFileName = (filename) => {
  const suffix = getSuffix(filename);
  const len = 32;
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const maxPos = chars.length;
  let pwd = '';
  for (let i = 0; i < len; i += 1) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return suffix ? `${pwd}${suffix}` : '';
};

exports.passwordSecret = 'microants blog';
