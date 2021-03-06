import asyncHandler from 'express-async-handler';
import Roaster from '../models/Roaster.js';
import Coffee from '../models/Coffee.js';

// @desc  CREATE: Create a roaster
// @route POST /roaster
// @access PRIVATE
export const createRoaster = asyncHandler(async (req, res) => {
  const { name, about, logo, location } = req.body;
  try {
    const newRoaster = await Roaster.create({
      name,
      about,
      logo,
      location,
    });

    if (newRoaster) {
      res.status(201).json({
        _id: newRoaster.id,
        name: newRoaster.name,
        logo: newRoaster.logo,
        location: newRoaster.location,
        joined: new Date(newRoaster.createdAt).toLocaleDateString(),
      });
    }
  } catch (error) {
    res.status(400);

    throw new Error(
      'There was an error creating your account. Please try again'
    );
  }
});

// @desc  READ: Get all roasters
// @route GET /roaster
// @access PRIVATE

export const getAllRoasters = asyncHandler(async (req, res) => {
  try {
    const roasters = await Roaster.find({});
    if (roasters) res.json(roasters);
  } catch (error) {
    res.status(404);
    throw new Error('Roasters not found');
  }
});

// @desc  READ: Get a specific roaster
// @route GET /roaster/:id
// @access PRIVATE

export const getRoasterById = asyncHandler(async (req, res) => {
  try {
    const roaster = await Roaster.findById(req.params.id);
    if (roaster) res.json(roaster);
  } catch (error) {
    res.status(404);
    throw new Error('Roaster not found');
  }
});

//@desc UPDATE: Update a specific roaster
//@route PUT /roaster/update
//@access PRIVATE

export const updateRoaster = asyncHandler(async (req, res) => {
  try {
    const roaster = await Roaster.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.json(roaster);
  } catch (error) {
    res.status(404);
    throw new Error('Roaster not found');
  }
});

//@desc DELETE: Remove a roaster and all of it's coffees
//@route PUT /roaster/:id
//@access PRIVATE(ADMIN)
export const removeRoaster = asyncHandler(async (req, res) => {
  const roaster = await Roaster.findById(req.params.id);
  if (roaster) {
    await Coffee.deleteMany({ roaster: roaster._id });
    roaster.remove();
    res.json('Roaster and coffee removed');
  } else {
    res.status(404);
    throw new Error('Roaster not found');
  }
});
