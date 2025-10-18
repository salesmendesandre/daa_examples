import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import EssentialGearList from './components/EssentialGearList.jsx'
import ReadingListItem from './components/ReadingListItem.jsx'
import MessageListItem from './components/MessageListItem.jsx'
import RecipeIngredient from './components/RecipeIngredient.jsx'
import MountainPackingList from './components/MountainPackingList.jsx'
import OptionalGearItem from './components/OptionalGearItem.jsx'
import PanelistList from './components/PanelistList.jsx'
import WorkshopList from './components/WorkshopList.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <h1>Renderizado condicional - Ejemplos</h1>
      <h2 class="title-component">Control de flujo con if y return:</h2>
      <span class="component">
        <MountainPackingList></MountainPackingList>
      </span>

      <h2 class="title-component">Omitir contenido devolviendo null:</h2>
         <span class="component">
      <OptionalGearItem name="Saco de dormir" isPacked={false} />
        <OptionalGearItem name="Cámara" isPacked={true} />
      </span>

      <h2 class="title-component">Incluir o excluir JSX desde el componente padre</h2>
      <span class="component">
      <EssentialGearList showPackedItems={false} /> {/* Podemos cambiar a true o false */}
      </span>

      <h2 class="title-component">Operador ternario ? : para reducir duplicación</h2>

      <span class="component">
      <ReadingListItem title="El Hobbit" isCompleted={false} />
      </span>
      <span class="component">
      <ReadingListItem title="1984" isCompleted={true} />
      </span>


      <h2 class="title-component">Operador lógico && para mostrar algo o nada </h2>

      <span class="component">
      <MessageListItem sender="Alice" isPriority={true} />
      <MessageListItem sender="Bob" isPriority={false} />
      <RecipeIngredient name="Harina" isOptional={false} notes="500g" />
      </span>
      <h2 class="title-component">Asignar JSX a una variable temporal</h2>
      <RecipeIngredient name="Azúcar" isOptional={true} notes="Al gusto" />
      <RecipeIngredient name="Mantequilla" isOptional={false} notes="200g" />

      <h1>Renderizado de listas - Ejemplos</h1>
      <h2 class="title-component">Transformar arreglos con map</h2>
      <span class="component">
      <PanelistList />
      </span>

      <h2 class="title-component">Filtrar colecciones antes de renderizar</h2>
      <span class="component">
      <WorkshopList category="frontend" />
      </span>

      <span class="component">
            <WorkshopList category="ux" />
      </span>

      

  </StrictMode>,
)
