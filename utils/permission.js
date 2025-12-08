const permissions = [
    { name: "user.browse", view: "User browse", group: "User" },
    { name: "user.create", view: "User create", group: "User" },
    { name: "user.edit", view: "User edit", group: "User" },
    { name: "user.delete", view: "User delete", group: "User" },
    { name: "role.browse", view: "Role browse", group: "Role" },

    { name: "role.create", view: "Role create", group: "Role" },
    { name: "role.edit", view: "Role edit", group: "Role" },
    { name: "role.delete", view: "Role delete", group: "Role" },
    
    { name: "news.browse", view: "News browse", group: "News" },
];

module.exports = permissions;
