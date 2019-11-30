import Realm from 'realm';

export const PRODUCT_SCHEMA = "Product";
export const EXTRA_SCHEMA = "Extra";
export const EPAISA_SCHEMA = "Epaisa";
export const ProductSchema = {
  name: 'Product',
  properties: {
    id:  'int',
    name: 'string',
    quant: 'int',
    unitPrice: 'double',
    total: 'double',
    discount: 'double',
    type: 'string',
    image: 'string',
  }
};
export const ExtrasSchema = {
  name: EXTRA_SCHEMA,
  properties: {
    discount:  'double',
    delivery: 'double',
    option: 'string',
    type: 'string',
  }
};
export const EpaisaSchema = {
  name: EPAISA_SCHEMA,
  properties: {
    products:  {type:'list', objectType: PRODUCT_SCHEMA},
    extras: EXTRA_SCHEMA
  }
};
const databaseOptions={
  path:'epaisa.realm',
  schema: [ProductSchema, ExtrasSchema],
  schemaVersion:0
}
export const createNewProduct = newProduct=>{
    Realm.open(databaseOptions).then(realm=>{
      realm.write(()=>{
        
        
      /* console.log("REALM DATABASE:",newProduct)
       realm.create('Product',newProduct)*/
       //let elements=realm.objects(PRODUCT_SCHEMA)
       //console.log("REALM DATABASE2:",elements)
      })
    }).catch(error=>console.log(error))
}