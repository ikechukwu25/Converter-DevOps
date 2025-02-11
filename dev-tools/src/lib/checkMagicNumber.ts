export const checkMagicNumber = async (file: File): Promise<string> => {
  let magicNumber = "";
  const reader = new FileReader();
  reader.readAsArrayBuffer(file.slice(0, 4));
  reader.onload = (event: ProgressEvent<FileReader>) => {
    if (event.target && event.target.result) {
      const arrayBuffer = event.target.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);
      const hexString = Array.from(uint8Array.slice(0, 4)).map(byte => byte.toString(16).padStart(2, '0').toUpperCase()).join('');
      magicNumber = hexString;
    }
  }
  await new Promise((resolve) => {
    reader.onloadend = resolve;
  });
  return magicNumber;
};
