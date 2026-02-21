<script setup lang="ts">
definePageMeta({
  layout: "grand-tale",
});

useHead({
  title: "Grand Tale Leaderboards",
});

const leaders = [
  { rank: 1, name: "IllidanStormrage", soul: "Voidweaver", level: 99, power: 12500 },
  { rank: 2, name: "SylvanasWind", soul: "Banshee", level: 98, power: 12200 },
  { rank: 3, name: "ArthasMenethil", soul: "Deathknight", level: 97, power: 12100 },
  { rank: 4, name: "JainaProud", soul: "Archmage", level: 96, power: 11900 },
  { rank: 5, name: "ThrallWarchief", soul: "Shaman", level: 95, power: 11800 },
];
</script>

<template>
  <div class="py-20">
    <UContainer>
      <div class="space-y-12">
        <div class="flex flex-col md:flex-row justify-between items-end gap-6">
          <div class="space-y-4">
            <h1 class="text-4xl font-black uppercase tracking-tighter text-white">
              Global Standings
            </h1>
            <p class="text-grand-tale-secondary-100/60">The top adventurers across all realms.</p>
          </div>
          <UTabs
            :items="[
              { label: 'Power Level' },
              { label: 'Speedruns' },
              { label: 'PVP' },
              { label: 'Guilds' },
            ]"
            class="w-full md:w-auto"
          />
        </div>

        <div class="bg-grand-tale-primary-950/40 border border-grand-tale-secondary-800/50">
          <table class="w-full text-left">
            <thead>
              <tr
                class="border-b border-grand-tale-secondary-800/50 bg-grand-tale-primary-900/50 text-xs font-bold uppercase tracking-widest text-grand-tale-secondary-500"
              >
                <th class="p-6">Rank</th>
                <th class="p-6">Player</th>
                <th class="p-6">Soul Path</th>
                <th class="p-6">Level</th>
                <th class="p-6">Power Score</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-grand-tale-secondary-800/30">
              <tr
                v-for="player in leaders"
                :key="player.rank"
                class="hover:bg-grand-tale-primary-800/10 transition-colors group"
              >
                <td class="p-6">
                  <span
                    :class="[
                      'font-black text-xl italic',
                      player.rank === 1
                        ? 'text-yellow-500'
                        : player.rank === 2
                          ? 'text-gray-400'
                          : player.rank === 3
                            ? 'text-orange-600'
                            : 'text-grand-tale-secondary-800',
                    ]"
                    >#{{ player.rank }}</span
                  >
                </td>
                <td class="p-6">
                  <div class="flex items-center gap-3">
                    <UAvatar
                      :alt="player.name"
                      size="sm"
                      class="ring-1 ring-grand-tale-secondary-500/30"
                    />
                    <span class="font-bold text-white group-hover:text-grand-tale-secondary-400">{{
                      player.name
                    }}</span>
                  </div>
                </td>
                <td class="p-6 text-grand-tale-secondary-100/60">{{ player.soul }}</td>
                <td class="p-6 text-white font-mono">{{ player.level }}</td>
                <td class="p-6">
                  <span class="text-grand-tale-secondary-400 font-bold tabular-nums">{{
                    player.power.toLocaleString()
                  }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </UContainer>
  </div>
</template>
