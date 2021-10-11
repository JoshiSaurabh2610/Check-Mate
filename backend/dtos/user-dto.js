class UserDto{
    id;
    phoneNo;
    activated;
    createdAt;
    name;
    avatar;

    constructor(user){
        this.id = user._id;
        this.phoneNo = user.phone;
        this.activated = user.activated;
        this.createdAt = user.createdAt;
        this.name = user.name;
        this.avatar = user.avatar ? `${process.env.BASE_URL}${user.avatar}`: null;
    }

}

module.exports = UserDto;