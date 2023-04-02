const router = require('express').Router();
const { Tag, Product, ProductTag, Category } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {

  Product.findAll({attributes: ['id', 'product_name', 'price', 'stock'],
include: [{
  model: Category,
  attributes: ['category_name']
},
{  model: Tag,
  attributes: ['tag_name']
}
]
})
.then(dbProductData => res.json(dbProductData))
.catch(err => {
  console.log(err);
  res.status(500).json(err);
});
});
  // find all tags
  // be sure to include its associated Product data


router.get('/:id', (req, res) => {

  Product.findOne({    where: {
    id: req.params.id
  }, 
  attributes: ['id', 'product_name', 'price', 'stock'],
  include: [{
    model: Category,
    attributes: ['category_name']
  },
  {  model: Tag,
    attributes: ['tag_name']
  }
  ]
  })
  .then(dbProductData => { if(!dbProductData) {res.status(404).json
   ({message: 'no prudct found'});
   return;
  }
  res.json(dbProductData);
})
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
  });

  // find a single tag by its `id`
  // be sure to include its associated Product data



router.post('/', (req, res) => {

  Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    category_id: req.body.category_id,
    tagIds: req.body.tagIds
    }).then ((product) => {
      if(req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
      });
      return ProductTag.bulkCreate(productTagIdArr);
    }
   
    res.status(200).json(product);
  })
  .then((productTagIds) => res.status(200).json(productTagIds))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
    });
  
});

router.put('/:id', (req, res) => {
Product.update(req.body, { where: { id: req.params.id,},
}).then((product) => {
  return ProductTag.findAll({ where: { product_id: req.params.id } });
}) .then((productTags) => {
  const productTagIds = productTags.map(({ tag_id }) => tag_id);
  const newProductTags = req.body.tagIds
  .filter((tag_id) => !productTagIds.includes(tag_id))

.map((tag_id) => {
  return {
    product_id: req.params.id,
    tag_id,
};
});
const productTagstoRemove = productTags
.filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
.map(({ id }) => id);
return Promise.all([
ProductTag.destroy({ where: { id: productTagstoRemove } }),
ProductTag.bulkCreate(newProductTags),
]);
}).then((updatedProductTags) => res.json(updatedProductTags))
.catch((err) => {
  // console.log(err);
  res.status(400).json(err);
});
});

  // update a tag's name by its `id` value


router.delete('/:id', (req, res) => {
  Product.destroy({ where: { id: req.params.id }
  }).then(dbProductData => {
    if (!dbProductData) {
      rs.status(404).json({message: 'No product found with this id'});
      return;
    }
    res.json(dbProductData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
  // delete on tag by its `id` value
});

module.exports = router;
