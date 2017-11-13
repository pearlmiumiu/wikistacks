var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack');

var Page = db.define('page', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isUrl: true
        }
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed'),
    },
    date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }

} , {
  getterMethods: {
      route() {
        return '/wiki/'+ this.urlTitle;
      }
    },
    hooks: {
      beforeValidate: (page, options) => {
        function generateUrlTitle (title) {
          if (title) {
            // Removes all non-alphanumeric characters from title
            // And make whitespace underscore
            this.urlTitle = this.title.replace(/\s+/g, '_').replace(/\W/g, '');
          } else {
            // Generates random 5 letter string
            this.urlTitle = Math.random().toString(36).substring(2, 7);
          }
        }  
      }
    }
});



var User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        }
    }
});

module.exports = {
  db: db,
  Page: Page,
  User: User
};











//
