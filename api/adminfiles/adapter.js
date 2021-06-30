const { Database, Resource: SequelizeResource } = require("@admin-bro/sequelize");
const { BaseRecord } = require("admin-bro");
const { Op } = require("sequelize");

class Resource extends SequelizeResource {
  titleField() {
    console.log("entro a title");
    return this.decorate().titleProperty().name();
  }
  wrapObject(obj) {
    console.log(obj, "obj");
    return new BaseRecord(obj.toJSON(), this);
  }
  wrapObjects(sequelizeObjects) {
    console.log("1");
    return sequelizeObjects.map((sequelizeObject) => this.wrapObject(sequelizeObject));
  }

  associationFor(toResourceId) {
    const associations = this.getAssociationsByResourceId(toResourceId);
    return keyBy(associations, (v) => v.as);
  }

  async findRelated(record, toResourceId, options = {}) {
    console.log("2");
    /* { order: [ 'name' ] } options */
    const instance = this.getInstance(record);

    /* [ roles ] association */
    const association = this.getAssociationsByResourceId(toResourceId)[0];
    //console.log(association, "association");
    return await instance[association.accessors.get](options);
  }

  getAssociationsByResourceId(alias) {
    console.log(alias, "alias");
    /*    console.log(alias, "alias");
    const veremos = Object.values(this.SequelizeModel.associations).forEach(
      (association) => console.log(association.as)
    );
    console.log(veremos, "association.as"); */
    return Object.values(this.SequelizeModel.associations).filter(
      (association) => association.as === alias
    );

    /* retorna [roles] */
  }

  getInstance(record) {
    console.log("6");
    return new this.SequelizeModel(record.params, { isNewRecord: false });
  }

  async saveRecords(record, resourceId, ids) {
    console.log("7");
    /* [class Database extends BaseDatabase] Database */
    const instance = this.getInstance(record);
    console.log("8");
    /*  [] ids
     */
    const association = this.getAssociationsByResourceId(resourceId)[0];
    console.log(association, "association");
    /* Roles association */
    /* [
  [
    role_user {
      dataValues: [Object],
      _previousDataValues: [Object],
      _changed: Set(0) {},
      _options: [Object],
      isNewRecord: false
    }
  ]
] assoset
 */
    await association.set(instance, ids);
    /* aca se setean los roles */
  }

  primaryKeyField() {
    console.log("entro a primarykey");
    console.log("9");
    /* id primaryKey
     */
    return this.SequelizeModel.primaryKeyField;
  }

  getManyProperties() {
    console.log("10");
    /* [ 'roles' ] getmany
     */
    return this.decorate()
      .getProperties({ where: "edit" })
      .filter((p) => p.type() === "many")
      .map((p) => p.name());
  }
}

module.exports = { Database, Resource };
