const flowParser = require('./parser/mermaid/flow');

// todo: mermaid need more api support
// import mermaid from 'mermaid';
// const { mermaidAPI } = mermaid;

const Converter = {
  flowParser: () => {
    let parser = flowParser;
    return parser;
  },
};

export default Converter;

