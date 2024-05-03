const mongoose = require('mongoose');
const { Schema, model } = mongoose;

class Mongodb {
  static async connect() {
    try {
      // mongoose.set("strictQuery", true);
      await mongoose.connect(
        'mongodb+srv://whiskas:iJOqqYX6fMlBtYko@cluster0.lklhdfm.mongodb.net/?retryWrites=true&w=majority',
        {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true
        }
      );
      console.log("連接 MongoDB 成功");
    } catch (error) {
      console.error("Error MongoDB =>", error);
    }
  }
  static modelList() {
    const ListSchema = new Schema({
      name: {
        type: String
      }
    });
    const list = model('taichung_od', ListSchema, 'taichung_list')
    return list
  }
  static async read() {
    const peopleModel = this.model('read');
    let rsp = await peopleModel.find({});
    return rsp
  }
  static async create(data) {
    try {
      const Model = this.modelList();
      const insertData = data.map(item => {
        return {
          name: item
        }
      });
      let test = insertData.splice(0,10)
      console.log('insertData',test);
      await Model.insertMany(test);

      return {
        status: true,
        message: "新增成功!"
      }
    } catch (error) {
      console.log(error)
      return {
        status: false,
        message: "新增失敗!"
      }
    }
  }
}

module.exports = Mongodb