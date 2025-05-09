const Category = require('../models/category.model');

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('parent', 'name');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching categories' });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('parent', 'name');
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching the category' });
  }
};

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, parent } = req.body;
    
    // Check if category name is unique
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'A category with this name already exists' });
    }

    // If parent category is specified, check if it exists
    let parentId = null;
    if (parent) {
      try {
        const parentCategory = await Category.findById(parent);
        if (!parentCategory) {
          return res.status(400).json({ message: 'Specified parent category not found' });
        }
        parentId = parentCategory._id;
      } catch (error) {
        return res.status(400).json({ message: 'Invalid parent category ID format' });
      }
    }

    // Slug will be automatically created (via model middleware)
    const category = new Category({
      name,
      description,
      parent: parentId,
      createdBy: req.user._id, // User from auth middleware
      isActive: true
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error('Category creation error:', error);
    res.status(500).json({ message: 'An error occurred while creating the category' });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, parent, isActive } = req.body;
        
    // If name is being changed, check if new name is unique
    if (name) {
      const existingCategory = await Category.findOne({ 
        name, 
        _id: { $ne: req.params.id } 
      });
      if (existingCategory) {
        return res.status(400).json({ message: 'A category with this name already exists' });
      }
    }

    // If parent category is specified, check if it exists
    let parentId = null;
    if (parent) {
      try {
        const parentCategory = await Category.findById(parent);
        if (!parentCategory) {
          return res.status(400).json({ message: 'Specified parent category not found' });
        }
        
        // Prevent category from being its own parent
        if (parent.toString() === req.params.id) {
          return res.status(400).json({ message: 'A category cannot be its own parent' });
        }
        
        parentId = parentCategory._id;
      } catch (error) {
        console.error('Parent category check error:', error);
        return res.status(400).json({ message: 'Invalid parent category ID format' });
      }
    }

    const updateData = {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      parent: parentId,
      ...(isActive !== undefined && { isActive })
    };

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('parent', 'name');

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Category update error:', error);
    res.status(500).json({ message: 'An error occurred while updating the category' });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    // Check for subcategories
    const hasChildren = await Category.exists({ parent: req.params.id });
    if (hasChildren) {
      return res.status(400).json({ message: 'This category has subcategories. Please delete subcategories first.' });
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while deleting the category' });
  }
};

// Get subcategories of a specific category
exports.getSubcategories = async (req, res) => {
  try {
    const subcategories = await Category.find({ parent: req.params.id });
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching subcategories' });
  }
};

// Get main categories (categories with parent=null)
exports.getMainCategories = async (req, res) => {
  try {
    const mainCategories = await Category.find({ parent: null });
    res.json(mainCategories);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching main categories' });
  }
};

// Get category by slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    if (!slug) {
      return res.status(400).json({ message: 'Invalid slug parameter' });
    }
    
    const category = await Category.findOne({ slug: slug });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching the category' });
  }
};

 