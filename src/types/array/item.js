const { MappingBaseType } = require("../base");
const { isFunction } = require("../util");
const { createDefinitionRefResolver } = require("../definition");

const createMappingItem = config => {
  return item => {
    return new MappingItem(item, config);
  };
};

class MappingItem extends MappingBaseType {
  constructor(item, config = {}) {
    super(config);
    this.item = item;
    this.config = config;
    this.ownerName = owner.name.id;
    this.definitionResolver =
      config.definitionResolver || createDefinitionRefResolver(config);
  }

  get resolver() {
    return this.config.itemResolver;
  }

  get validResolver() {
    return this.validatedResolver(this.resolver);
  }

  validatedResolver(resolver) {
    if (!isFunction(resolver)) {
      this.error(
        "typeResolver",
        "Missing createSchemaEntry (pass in config factories map)"
      );
    }
    return resolver;
  }

  resolve() {
    const payload = this.itemEntryPayload(this.item);
    return this.validResolver(payload, this.config);
  }

  itemEntryPayload() {
    return {
      parentName: this.key,
      value: this.item
    };
  }
}

module.exports = {
  createMappingItem,
  MappingItem
};