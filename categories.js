(() => {
  'use strict';

  const CATEGORY_TREE = {
    'Grocery & Food': ['Fruits & vegetables','Meat & seafood','Dairy & eggs','Bread & bakery','Frozen foods','Snacks','Candy','Cereal & breakfast foods','Canned foods','Pasta & rice','Sauces & condiments','Spices & seasonings','Drinks','Baking supplies'],
    'Home & Household': ['Cleaning supplies','Laundry supplies','Paper towels & tissues','Trash bags','Storage containers','Kitchen supplies','Cookware','Dishes & utensils','Light bulbs','Batteries','Air fresheners'],
    'Health & Personal Care': ['Shampoo & conditioner','Soap & body wash','Toothpaste & toothbrushes','Deodorant','Skincare','Hair-care products','First-aid supplies','Vitamins','Personal hygiene products'],
    'Clothing': ['Shirts','Pants','Shorts','Dresses','Jackets','Underwear','Socks','Shoes','Hats','Accessories'],
    'Electronics': ['Phones','Tablets','Chargers','Cables','Headphones','Speakers','TVs','Computer accessories','Smart-home devices','Batteries'],
    'Entertainment': ['Video games','Gaming accessories','Movies','Books','Toys','Board games','Puzzles','Trading cards'],
    'School & Office': ['Notebooks','Pens & pencils','Markers','Folders','Backpacks','Glue','Scissors','Printer paper','Calculators','Office supplies'],
    'Pet Supplies': ['Dog food','Cat food','Treats','Toys','Leashes & collars','Pet beds','Litter','Grooming supplies','Food/water bowls'],
    'Automotive': ['Motor oil','Car cleaners','Air fresheners','Wiper blades','Car accessories','Emergency supplies','Cleaning tools'],
    'Outdoor & Garden': ['Plants','Seeds','Soil','Gardening tools','Outdoor furniture','Grills','Camping supplies','Pool supplies'],
    'Hardware & DIY': ['Tools','Screws & nails','Tape','Glue & adhesives','Paint','Electrical supplies','Plumbing supplies','Building materials'],
    'Seasonal & Miscellaneous': ['Holiday decorations','Gifts','Party supplies','Cards','Wrapping paper','School-season items','Halloween items','Christmas items','Easter items']
  };

  const EMOJIS = {
    'Grocery & Food':'🛒','Home & Household':'🧹','Health & Personal Care':'🧴','Clothing':'👕','Electronics':'📱','Entertainment':'🎮','School & Office':'🏫','Pet Supplies':'🐶','Automotive':'🚗','Outdoor & Garden':'🌳','Hardware & DIY':'🔨','Seasonal & Miscellaneous':'🎁'
  };

  const RULES = [
    [/\b(apple|banana|lettuce|tomato|potato|onion|carrot|broccoli|spinach|fruit|vegetable|berry|berries|avocado|orange|grape|pepper|cucumber)\b/i, 'Grocery & Food','Fruits & vegetables'],
    [/\b(chicken|beef|pork|turkey|steak|meat|sausage|fish|salmon|shrimp|seafood)\b/i, 'Grocery & Food','Meat & seafood'],
    [/\b(milk|cheese|yogurt|butter|cream|egg|eggs)\b/i, 'Grocery & Food','Dairy & eggs'],
    [/\b(bread|bun|bagel|roll|tortilla|bakery|croissant)\b/i, 'Grocery & Food','Bread & bakery'],
    [/\b(frozen|ice cream|frozen pizza)\b/i, 'Grocery & Food','Frozen foods'],
    [/\b(chips|cracker|pretzel|snack|popcorn|nuts)\b/i, 'Grocery & Food','Snacks'],
    [/\b(candy|chocolate|gummy|gum)\b/i, 'Grocery & Food','Candy'],
    [/\b(cereal|oatmeal|pancake|waffle|breakfast)\b/i, 'Grocery & Food','Cereal & breakfast foods'],
    [/\b(canned|beans|soup)\b/i, 'Grocery & Food','Canned foods'],
    [/\b(pasta|spaghetti|macaroni|rice)\b/i, 'Grocery & Food','Pasta & rice'],
    [/\b(ketchup|mustard|mayo|mayonnaise|salsa|sauce|dressing|condiment)\b/i, 'Grocery & Food','Sauces & condiments'],
    [/\b(salt|pepper|spice|spices|seasoning|cinnamon|paprika|garlic powder)\b/i, 'Grocery & Food','Spices & seasonings'],
    [/\b(water|soda|juice|coffee|tea|drink|drinks|sports drink)\b/i, 'Grocery & Food','Drinks'],
    [/\b(flour|sugar|baking|cake mix|brownie mix|vanilla extract)\b/i, 'Grocery & Food','Baking supplies'],
    [/\b(cleaner|cleaning|disinfectant|sponge|dish soap)\b/i, 'Home & Household','Cleaning supplies'],
    [/\b(laundry|detergent|dryer sheet|fabric softener)\b/i, 'Home & Household','Laundry supplies'],
    [/\b(paper towel|paper towels|tissue|tissues)\b/i, 'Home & Household','Paper towels & tissues'],
    [/\b(trash bag|garbage bag)\b/i, 'Home & Household','Trash bags'],
    [/\b(storage|container|containers|zip bag)\b/i, 'Home & Household','Storage containers'],
    [/\b(pan|pot|cookware|spatula|kitchen)\b/i, 'Home & Household','Kitchen supplies'],
    [/\b(plate|bowl|cup|fork|spoon|utensil)\b/i, 'Home & Household','Dishes & utensils'],
    [/\b(light bulb|bulb)\b/i, 'Home & Household','Light bulbs'],
    [/\bbatter(y|ies)\b/i, 'Home & Household','Batteries'],
    [/\b(air freshener)\b/i, 'Home & Household','Air fresheners'],
    [/\b(shampoo|conditioner)\b/i, 'Health & Personal Care','Shampoo & conditioner'],
    [/\b(soap|body wash)\b/i, 'Health & Personal Care','Soap & body wash'],
    [/\b(toothpaste|toothbrush)\b/i, 'Health & Personal Care','Toothpaste & toothbrushes'],
    [/\b(deodorant)\b/i, 'Health & Personal Care','Deodorant'],
    [/\b(skincare|lotion|moisturizer)\b/i, 'Health & Personal Care','Skincare'],
    [/\b(hair care|hair-care|hair gel|hair spray)\b/i, 'Health & Personal Care','Hair-care products'],
    [/\b(first aid|bandage|bandages|antiseptic)\b/i, 'Health & Personal Care','First-aid supplies'],
    [/\b(vitamin|vitamins)\b/i, 'Health & Personal Care','Vitamins'],
    [/\b(dog food)\b/i, 'Pet Supplies','Dog food'],
    [/\b(cat food)\b/i, 'Pet Supplies','Cat food'],
    [/\b(treats|pet treat)\b/i, 'Pet Supplies','Treats'],
    [/\b(leash|collar)\b/i, 'Pet Supplies','Leashes & collars'],
    [/\b(pet bed)\b/i, 'Pet Supplies','Pet beds'],
    [/\b(litter)\b/i, 'Pet Supplies','Litter'],
    [/\b(pet grooming|grooming)\b/i, 'Pet Supplies','Grooming supplies'],
    [/\b(pet bowl|food bowl|water bowl)\b/i, 'Pet Supplies','Food/water bowls'],
    [/\b(phone|iphone|android)\b/i, 'Electronics','Phones'],
    [/\b(tablet|ipad)\b/i, 'Electronics','Tablets'],
    [/\b(charger|charging)\b/i, 'Electronics','Chargers'],
    [/\b(cable|hdmi|usb)\b/i, 'Electronics','Cables'],
    [/\b(headphones|earbuds)\b/i, 'Electronics','Headphones'],
    [/\b(speaker)\b/i, 'Electronics','Speakers'],
    [/\b(tv|television)\b/i, 'Electronics','TVs'],
    [/\b(controller|gaming|gamepad)\b/i, 'Entertainment','Gaming accessories'],
    [/\b(video game|videogame|playstation|xbox|nintendo)\b/i, 'Entertainment','Video games'],
    [/\b(movie|dvd|blu-ray)\b/i, 'Entertainment','Movies'],
    [/\b(book|novel)\b/i, 'Entertainment','Books'],
    [/\b(toy)\b/i, 'Entertainment','Toys'],
    [/\b(board game)\b/i, 'Entertainment','Board games'],
    [/\b(puzzle)\b/i, 'Entertainment','Puzzles'],
    [/\b(trading card|pokemon card)\b/i, 'Entertainment','Trading cards'],
    [/\b(notebook|journal)\b/i, 'School & Office','Notebooks'],
    [/\b(pen|pencil)\b/i, 'School & Office','Pens & pencils'],
    [/\b(marker)\b/i, 'School & Office','Markers'],
    [/\b(folder)\b/i, 'School & Office','Folders'],
    [/\b(backpack)\b/i, 'School & Office','Backpacks'],
    [/\b(glue|adhesive)\b/i, 'School & Office','Glue'],
    [/\b(scissors)\b/i, 'School & Office','Scissors'],
    [/\b(printer paper|copy paper)\b/i, 'School & Office','Printer paper'],
    [/\b(calculator)\b/i, 'School & Office','Calculators'],
    [/\b(motor oil)\b/i, 'Automotive','Motor oil'],
    [/\b(car cleaner|car wash)\b/i, 'Automotive','Car cleaners'],
    [/\b(wiper blade)\b/i, 'Automotive','Wiper blades'],
    [/\b(car accessory)\b/i, 'Automotive','Car accessories'],
    [/\b(plant)\b/i, 'Outdoor & Garden','Plants'],
    [/\b(seed|seeds)\b/i, 'Outdoor & Garden','Seeds'],
    [/\b(soil)\b/i, 'Outdoor & Garden','Soil'],
    [/\b(gardening tool)\b/i, 'Outdoor & Garden','Gardening tools'],
    [/\b(grill)\b/i, 'Outdoor & Garden','Grills'],
    [/\b(camping)\b/i, 'Outdoor & Garden','Camping supplies'],
    [/\b(pool)\b/i, 'Outdoor & Garden','Pool supplies'],
    [/\b(tool|tools|hammer|screwdriver|drill)\b/i, 'Hardware & DIY','Tools'],
    [/\b(screw|screws|nail|nails)\b/i, 'Hardware & DIY','Screws & nails'],
    [/\b(tape)\b/i, 'Hardware & DIY','Tape'],
    [/\b(paint)\b/i, 'Hardware & DIY','Paint'],
    [/\b(electrical)\b/i, 'Hardware & DIY','Electrical supplies'],
    [/\b(plumbing|pipe)\b/i, 'Hardware & DIY','Plumbing supplies'],
    [/\b(holiday decoration|decoration)\b/i, 'Seasonal & Miscellaneous','Holiday decorations'],
    [/\b(gift)\b/i, 'Seasonal & Miscellaneous','Gifts'],
    [/\b(party supply|party supplies)\b/i, 'Seasonal & Miscellaneous','Party supplies'],
    [/\b(card|greeting card)\b/i, 'Seasonal & Miscellaneous','Cards'],
    [/\b(wrapping paper)\b/i, 'Seasonal & Miscellaneous','Wrapping paper'],
    [/\b(halloween)\b/i, 'Seasonal & Miscellaneous','Halloween items'],
    [/\b(christmas)\b/i, 'Seasonal & Miscellaneous','Christmas items'],
    [/\b(easter)\b/i, 'Seasonal & Miscellaneous','Easter items']
  ];

  function categoryValue(parent, child) { return `${parent} / ${child}`; }
  function detectCategory(name) {
    const text = String(name || '').toLowerCase();
    for (const [regex, parent, child] of RULES) if (regex.test(text)) return categoryValue(parent, child);
    return categoryValue('Grocery & Food', 'Other');
  }

  function populateCategorySelect() {
    const select = document.getElementById('itemCategory');
    if (!select) return;
    const current = select.value;
    select.innerHTML = '';
    for (const [parent, children] of Object.entries(CATEGORY_TREE)) {
      const group = document.createElement('optgroup');
      group.label = `${EMOJIS[parent] || '🛍️'} ${parent}`;
      children.forEach(child => {
        const option = document.createElement('option');
        option.value = categoryValue(parent, child);
        option.textContent = child;
        group.appendChild(option);
      });
      select.appendChild(group);
    }
    select.value = [...select.options].some(o => o.value === current) ? current : detectCategory(document.getElementById('itemName')?.value || '');
  }

  function patchAddItem() {
    if (typeof window.addItem !== 'function' || window.__categoryPatch) return;
    const original = window.addItem;
    window.addItem = function(raw) {
      const before = JSON.parse(localStorage.getItem('grocery-assistant-v1') || '{}');
      original(raw);
      const d = JSON.parse(localStorage.getItem('grocery-assistant-v1') || '{}');
      if (Array.isArray(d.items) && d.items.length > (before.items || []).length) {
        const added = d.items[d.items.length - 1];
        added.category = detectCategory(added.name);
        localStorage.setItem('grocery-assistant-v1', JSON.stringify(d));
        window.render?.();
      }
    };
    window.__categoryPatch = true;
  }

  function addCategoryEmojiSupport() {
    const original = window.catEmoji;
    if (typeof original !== 'function' || window.__emojiPatch) return;
    window.catEmoji = function(category) {
      const parent = String(category || '').split(' / ')[0];
      return EMOJIS[parent] || original(category);
    };
    window.__emojiPatch = true;
  }

  function init() {
    populateCategorySelect();
    patchAddItem();
    addCategoryEmojiSupport();
  }

  window.GroceryCategories = { tree: CATEGORY_TREE, detect: detectCategory, emoji: EMOJIS };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
