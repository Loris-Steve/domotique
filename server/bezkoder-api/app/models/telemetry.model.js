module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      deviceName: String,
      value: Number
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Telemetry = mongoose.model("telemetry", schema);
  return Telemetry;
};
