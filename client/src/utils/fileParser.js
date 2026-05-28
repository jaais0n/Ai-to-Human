/**
 * File parser utilities for .txt and .docx files
 */

export async function parseFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();

  if (ext === 'txt') {
    return parseTxt(file);
  } else if (ext === 'docx') {
    return parseDocx(file);
  } else {
    throw new Error('Unsupported file type. Please upload a .txt or .docx file.');
  }
}

function parseTxt(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file, 'UTF-8');
  });
}

async function parseDocx(file) {
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (err) {
    throw new Error('Failed to parse .docx file. Make sure it\'s a valid Word document.');
  }
}

export function downloadText(text, filename = 'humanized-content', format = 'txt') {
  const mimeTypes = {
    txt: 'text/plain',
    md: 'text/markdown',
  };

  const blob = new Blob([text], { type: mimeTypes[format] || 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.${format}`;
  a.click();
  URL.revokeObjectURL(url);
}
