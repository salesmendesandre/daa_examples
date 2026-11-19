<template>
  <nav>
    <RouterLink :to="{ name: 'notas' }">Notas</RouterLink>
    <RouterLink :to="{ name: 'nota-nueva' }">Nueva nota</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>
