class UserDto{
    id;
    phoneNo;
    activated;
    createdAt;

    constructor(user){
        this.id = user._id;
        this.phoneNo = user.phone;
        this.activated = user.activated;
        this.createdAt = user.createdAt;
    }

}

module.exports = UserDto;