const { unflatten } = require("flat");
const { BaseRecord } = require("admin-bro");

const setResponseItems = async (context, response, toResourceId) => {
  const { _admin, resource, record } = context;
  let toResource = _admin.findResource(toResourceId);

  if (toResourceId === "roles") {
    var options = { order: ["name"] };
  } else {
    var options = { order: [toResource.titleField()] };
  }
  /* { order: [ 'name' ] } options*/
  const throughItems = await resource.findRelated(record, toResourceId, options);

  if (toResourceId === "roles") {
    if (throughItems.length > 0) {
      var itemGenerico = [];
      for (let i = 0; i < throughItems.length; i++) {
        let j = new BaseRecord(throughItems[i].toJSON());
        j = {
          ...j,
          resource: toResourceId,
        };
        itemGenerico.push(j);
      }
      const primaryKeyField = "id";
      response.record.populated[toResourceId] = itemGenerico;
      response.record.params[toResourceId] = itemGenerico.map(
        (v) => v.params[primaryKeyField || "id"]
      );
    }
  } else {
    var items = toResource.wrapObjects(throughItems);
    if (items.length !== 0) {
      const primaryKeyField = toResource.primaryKeyField();
      /* primaryKeyField = id  */
      response.record.populated[toResourceId] = items;
      response.record.params[toResourceId] = items.map((v) => v.params[primaryKeyField || "id"]);
      /* [ 1 ] verparams
       */
    }
  }
};

const after = async (response, request, context) => {
  console.log("entro aca??");
  if (request && request.method) {
    /* entra aca cuando cargo el nuevo record */
    const manyProperties = context.resource.getManyProperties();
    /* [ 'roles' ] manyProperties */
    /* PARA EDITAR UN NUEVO ELEMENTO */
    if (context.action.name == "edit" && request.method === "get") {
      /* ACA ENTRA SOLO CON EDIT, NO CON ELEMENTO NUEVO */
      // Load all linked data
      await Promise.all(
        manyProperties.map(async (toResourceId) => {
          await setResponseItems(context, response, toResourceId);
        })
      );
    }
    /* PARA CREAR UN ELEMENTO NUEVO */
    const { record } = context;
    if (request.method === "post" && record.isValid()) {
      /* aca entra cuando se genera un record nuevo */
      const params = unflatten(request.payload);

      await Promise.all(
        manyProperties.map(async (toResourceId) => {
          const ids = params[toResourceId] ? params[toResourceId].map((v) => parseInt(v)) : [];
          /* son los id dentro del array de roles */
          await context.resource.saveRecords(record, toResourceId, ids);
        })
      );
    }
  }

  return response;
};

module.exports = { after };
