
function Collection(c){
  this._init_(c);
}

Collection.prototype = {
  constructor: Collection,
  _init_: function(c){
    this.title = c.title;
    this.href = c.href;
  },
};

export default Collection;