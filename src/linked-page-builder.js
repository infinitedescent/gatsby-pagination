const hasPrevPage = (index, params, looping) => {
  const prevIndex = index - 1;
  if (looping) {
    return params.length > 1;
  }
  return prevIndex >= 0;
};

const getPrevPage = (index, params, looping) => {
  const prevIndex = index - 1;
  if (looping && !hasPrevPage(index, params)) {
    return params[params.length - 1];
  }
  return params[prevIndex];
};

const hasNextPage = (index, params, looping) => {
  const nextIndex = index + 1;
  if (looping) {
    return params.length > 1;
  }
  return nextIndex < params.length;
};

const getNextPage = (index, params, looping) => {
  const nextIndex = index + 1;
  if (looping && !hasNextPage(index, params)) {
    return params[0];
  }
  return params[nextIndex];
};

class LinkedPageBuilder {
  constructor(createPage, edges, component, edgeParser) {
    if (!createPage) throw Error("Argument `createPage` must be provided.");
    if (!edges) throw Error("Argument `edges` must be provided.");
    if (!component) throw Error("Argument `component` must be provided.");
    if (!edgeParser) throw Error("Argument `edgeParser` must be provided.");

    this.createPage = createPage;
    this.edges = edges;
    this.component = component;
    this.edgeParser = edgeParser;
    this.looping = false;

    this.setCircular = this.setCircular.bind(this);
    this.build = this.build.bind(this);
  }

  setCircular(value) {
    this.looping = value;
    return this;
  }

  build() {
    const params = this.edges.map(this.edgeParser);
    params.forEach((param, index) => {
      let data = {
        total: this.edges.length
      };
      if (hasPrevPage(index, params, this.looping))
        data.prev = getPrevPage(index, params, this.looping).path;
      if (hasNextPage(index, params, this.looping))
        data.next = getNextPage(index, params, this.looping).path;
      let payload = {
        path: param.path,
        component: this.component,
        context: Object.assign(param.context ? param.context : {}, data)
      };
      this.createPage(payload);
    });
  }
}

export default LinkedPageBuilder;
