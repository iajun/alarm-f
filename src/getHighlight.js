import { findAll } from "highlight-words-core";
const searchWords = ["救命", "救救我", "北京"];

const getHighLight = textToHighlight => {
  const chunks = findAll({
    searchWords,
    textToHighlight
  });

  const highlightedText = chunks
    .map(chunk => {
      const { end, highlight, start } = chunk;
      const text = textToHighlight.substr(start, end - start);
      if (highlight) {
        return `<mark>${text}</mark>`;
      } else {
        return text;
      }
    })
    .join("");
  return highlightedText;
};

export default getHighLight;
