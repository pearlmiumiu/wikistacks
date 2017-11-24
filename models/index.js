var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack',{
  logging: false
});

var Page = db.define('page', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: false
        // validate: {
        //   isUrl: true
        // }
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed'),
    },

    tags: {
      type:Sequelize.ARRAY(Sequelize.TEXT),
      //page.tags='programming, coding, javascript'
      set: function(value){
        var arrayOfTags;
        if (typeof value==='string'){
          arrayOfTags=value.split(',').map(function(s){
            return s.trim();
          });
          this.setDataValue('tags',arrayOfTags);
        }else{
          this.setDataValue('tags', value);
        }
      }, 
     /* //alternative way to set up route getter method. inside 
      route:{
        type: Sequelize.VIRTUAL,
        get(){
          return '/wiki/'+this.getDataValue('urlTitle')
        }
      }
     */




    }
    // date: {
    //   type: Sequelize.DATE,
    //   defaultValue: Sequelize.NOW
    // }

} , {
  getterMethods: {
      route() {
        return '/wiki/'+ this.urlTitle;
      }
    }
    
});

//hooks//
Page.hook('beforeValidate', (page, options)=>{
      if (page.title){
        page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '');
      }else{
        page.urlTitle=Math.random().toString(36).substring(2,7);
      }
    
});

//class method//
Page.findByTag=function(tag){
  return Page.findAll({
    where: {
      tags:{
        $overlap:[tag]
      }
    }
  });
}


//instance method//
Page.prototype.findSimilar=function(){
  return Page.findAll({
    where:{
      tags:{
        $overlap:this.tag
      },
      id:{
        $ne:this.id
      }
    }
  });
}






var User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,  //the database(wikistack) validate==set this rule
        unique: true,
        validate: { //sequelize itself validate this info
          isEmail: true
        }
    }
});



Page.belongsTo(User, {as:'author'})
//1-create author_id column in page
//with belongs to the source gets the foreignkey(originating table, page)
//ability to eagerly load(like a join)--syntax is inclue
//page instances get methods--setAuthor, getAuthor, removeAuthor
//more syntax --cascade abilities

module.exports = {
  db: db,
  Page: Page,
  User: User
};











//
