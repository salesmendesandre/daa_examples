// src/components/RecipeIngredient.jsx
export default function RecipeIngredient({ name, isOptional, notes }) {
  let ingredientContent = name;

  if (isOptional) {
    ingredientContent = <del>{name} (opcional) ✅</del>;
  }

  if (notes) {
    ingredientContent = (
      <>
        {ingredientContent}
        <em className="item-notes"> — {notes}</em>
      </>
    );
  }

  return <li className="item">{ingredientContent}</li>;
}