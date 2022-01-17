module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      title: String,
      qty:Array(Number),
      category:String,
      type:String,
      cuisine:String,
      inStock:Number,
      ingredients:Array(String),
      ratings:Array(Number),
      userRatings:Array(String),
      commentRatings:Array(String),
      commentWitoutRating:Array(String),
      userWitoutRating:Array(String),
      images:Array(String),
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Dish = mongoose.model("dish", schema);
  return Dish;
};
