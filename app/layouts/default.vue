<template>
  <div class="flex flex-col min-h-screen">
    <AppTopNav />
    <main class="flex-1 bg-base-300">
      <section class="p-4 lg:p-6 max-w-5xl mx-auto">
        <slot />
      </section>
    </main>
  </div>
</template>
