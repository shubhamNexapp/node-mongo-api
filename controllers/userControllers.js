const Logdata = require("../helper/log_file");
const User = require("../models/userSchema");
const messages = require("../utils/messages");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const utility = require("../utils/utility");
const path = require("path");

exports.createUser = async (
  firstName,
  lastName,
  userName,
  email,
  password,
  phone,
  role,
  about,
  city,
  latitude,
  longitude
) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const Result = {
        data: null,
        statusCode: 400,
        message: messages.error.USER_ALREADY_REGISTERED,
      };
      return Result;
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      let UserData = new User({
        firstName,
        lastName,
        userName,
        email,
        password: hashedPassword,
        phone,
        role,
        about,
        city,
        location: {
          type: "Point",
          coordinates: [latitude, longitude], // [longitude, latitude]
        },
        latitude,
        longitude,
        createdAt: new Date(),
      });

      UserData.userId = UserData._id;

      let saveData = await UserData.save();
      const Result = {
        data: saveData,
        statusCode: 200,
        message: messages.success.USER_REGISTER_SUCCESSFULLY,
      };
      return Result;
    }
  } catch (error) {
    var Method = "Geeting Error in Save User - (controllers(createUser))";
    Logdata.LogFileData(error, Method);
    const Result = {
      data: null,
      statusCode: 400,
      message: messages.error.ERROR,
    };
    return Result;
  }
};

exports.loginUser = async (email, password) => {
  try {
    // Check if the user with the provided email exists
    const user = await User.findOne({ email });
    if (!user) {
      const Result = {
        data: null,
        statusCode: 404,
        message: messages.error.USER_NOT_FOUND,
      };
      return Result;
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      const Result = {
        data: null,
        statusCode: 401,
        message: messages.error.INVALID_CREDENTIALS,
      };
      return Result;
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const baseURL = process.env.BASE_URL; // Base URL where images are served from
    const profileImagePath = process.env.PROFILE_IMAGE_URL_ROUTE;
    const pathfromDB = user.profile;

    const profileImageUrl = `${baseURL}${profileImagePath}${path.basename(
      pathfromDB
    )}`;

    const { profile, ...userData } = user.toObject();

    const responseData = { ...userData, profileImageUrl };

    const Result = {
      data: responseData,
      token,
      statusCode: 200,
      message: messages.success.LOGIN_SUCCESS,
    };

    return Result;
  } catch (error) {
    var Method = "Geeting Error in Save User - (controllers(createUser))";
    Logdata.LogFileData(error, Method);
    const Result = {
      data: null,
      statusCode: 400,
      message: messages.error.ERROR,
    };
    return Result;
  }
};

exports.getUserDetails = async (req) => {
  try {
    const usersList = await User.find({});

    if (!usersList) {
      const Result = {
        data: null,
        statusCode: 400,
        message: messages.error.USER_NOTFETCH,
      };
      return Result;
    }

    // const baseURL = process.env.BASE_URL; // Base URL where images are served from
    // const profileImagePath = process.env.PROFILE_IMAGE_URL_ROUTE;
    // const pathfromDB = user.profile

    // const profileImageUrl = `${baseURL}${profileImagePath}${path.basename(pathfromDB)}`;

    // const { profile, ...userData } = user.toObject();

    // const responseData = { ...userData, profileImageUrl };

    const Result = {
      data: usersList,
      statusCode: 200,
      message: messages.success.USER_FETCH_SUCCESSFULLY,
    };
    return Result;
  } catch (error) {
    var Method =
      "Geeting Error in Fetch User Data - (controllers(getUserDetails))";
    Logdata.LogFileData(error, Method);
    const Result = {
      data: null,
      statusCode: 400,
      message: messages.error.USER_NOTFETCH,
    };
    return Result;
  }
};

exports.getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      const Result = {
        data: null,
        statusCode: 400,
        message: messages.error.USER_NOTFETCH,
      };
      return Result;
    }

    let responseData;

    if (user.profile) {
      const baseURL = process.env.BASE_URL; // Base URL where images are served from
      const profileImagePath = process.env.PROFILE_IMAGE_URL_ROUTE;
      const pathfromDB = user.profile;

      const profileImageUrl = `${baseURL}${profileImagePath}${path.basename(
        pathfromDB
      )}`;

      const { profile, ...userData } = user.toObject();

      responseData = { ...userData, profileImageUrl };
    }

    let dataToSend;

    if (responseData) {
      dataToSend = responseData;
    } else {
      dataToSend = user;
    }

    const Result = {
      data: dataToSend,
      statusCode: 200,
      message: messages.success.USER_FETCH_SUCCESSFULLY,
    };
    return Result;
  } catch (error) {
    var Method =
      "Geeting Error in Fetch User Data - (controllers(getUserById))";
    Logdata.LogFileData(error, Method);
    const Result = {
      data: null,
      statusCode: 400,
      message: messages.error.USER_NOTFETCH,
    };
    return Result;
  }
};

exports.updateUser = async (
  userId,
  firstName,
  lastName,
  userName,
  email,
  phone,
  profile,
  role,
  about,
  city,
  latitude,
  longitude
) => {
  try {
    // Find the user by userId
    const userList = await User.findOne({ userId: userId });
    if (!userList) {
      const Result = {
        data: null,
        statusCode: 400,
        message: messages.error.USER_NOT_FOUND,
      };
      return Result;
    }

    userList.firstName = firstName;
    userList.lastName = lastName;
    userList.userName = userName;
    userList.email = email;
    userList.phone = phone;
    userList.role = role;
    userList.about = about;
    userList.city = city;
    userList.location = {
      type: "Point",
      coordinates: [latitude, longitude], // [longitude, latitude]
    };

    // Update profile image if provided in the request
    if (profile) {
      const profileImageUrl = `${process.env.PROFILE_IMAGE_PATH}${profile.filename}`;
      userList.profile = profileImageUrl;
    }

    // Update the user object with the updated properties
    Object.assign(userList, userList);

    let userUpdateData = await userList.save();
    const Result = {
      data: userUpdateData,
      statusCode: 200,
      message: messages.error.USER_UPDATE_SUCCESS,
    };
    return Result;
  } catch (error) {
    var Method =
      "Geeting Error in Update User Data - (controllers(updateUser))";
    Logdata.LogFileData(error, Method);
    const Result = {
      data: null,
      statusCode: 400,
      message: messages.error.USER_NOT_FOUND,
    };
    return Result;
  }
};

exports.deleteUser = async (userId) => {
  try {
    // Find the user by userId
    const userList = await User.findOne({ userId: userId });
    if (!userList) {
      const Result = {
        data: null,
        statusCode: 400,
        message: messages.error.USER_NOT_FOUND,
      };
      return Result;
    }

    await userList.deleteOne();

    const Result = {
      statusCode: 200,
      message: messages.error.USER_DELETE_SUCCESS,
    };
    return Result;
  } catch (error) {
    var Method = "Geeting Error in Delete User - (controllers(deleteUser))";
    Logdata.LogFileData(error, Method);
    const Result = {
      data: null,
      statusCode: 400,
      message: messages.error.USER_NOT_FOUND,
    };
    return Result;
  }
};

exports.uploadImg = async (image) => {
  try {
    if (!image) {
      res.status(400).send("no file uploaded");
    }

    let user = await Image.create({ image });
    res.status(201).json({ user, message: "data upload successfully" });

    const Result = {
      statusCode: 200,
      message: "data upload successfully",
      user: user,
    };
    return Result;
  } catch (error) {
    var Method = "Geeting Error in Delete User - (controllers(uploadImg))";
    Logdata.LogFileData(error, Method);
    const Result = {
      data: null,
      statusCode: 400,
      message: messages.error.USER_NOT_FOUND,
    };
    return Result;
  }
};
