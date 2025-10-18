import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import EssentialGearList from './components/EssentialGearList.jsx'
import ReadingListItem from './components/ReadingListItem.jsx'
import MessageListItem from './components/MessageListItem.jsx'
import RecipeIngredient from './components/RecipeIngredient.jsx'
import MountainPackingList from './components/MountainPackingList.jsx'
import OptionalGearItem from './components/OptionalGearItem.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <h1>Renderizado condicional y listas - Ejemplos</h1>
      <h2 class="title-component">Control de flujo con if y return</h2>
      <MountainPackingList></MountainPackingList>

      <h2 class="title-component">Omitir contenido devolviendo null</h2>
      <OptionalGearItem name="Saco de dormir" isPacked={false} />
      <OptionalGearItem name="Cámara" isPacked={true} />

      <h2 class="title-component">Incluir o excluir JSX desde el componente padre</h2>
      <EssentialGearList showPackedItems={false} /> //Podemos cambiar a true o false
          
      <h2 class="title-component">Operador ternario ? : para reducir duplicación</h2>
      <ReadingListItem title="El Hobbit" isCompleted={false} />
      <ReadingListItem title="1984" isCompleted={true} />


      <h2 class="title-component">Operador lógico && para mostrar algo o nada </h2>
      <MessageListItem sender="Alice" isPriority={true} />
      <MessageListItem sender="Bob" isPriority={false} />
      <RecipeIngredient name="Harina" isOptional={false} notes="500g" />

      <h2 class="title-component">Asignar JSX a una variable temporal</h2>
      <RecipeIngredient name="Azúcar" isOptional={true} notes="Al gusto" />
      <RecipeIngredient name="Mantequilla" isOptional={false} notes="200g" />

  </StrictMode>,
)
