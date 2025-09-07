'use server';

import { revalidatePath } from 'next/cache';
import type { Build, Comment } from './types';

let builds: Build[] = [
  {
    id: '1',
    name: 'Floating Celestial Castle',
    builderName: 'Alex',
    description:
      'A magnificent castle floating among the clouds, built with quartz and prismarine. It features tall spires, a grand central keep, and cascading waterfalls that fall into the void. The interior is lavishly decorated with gold blocks, chandeliers, and intricate stained glass windows depicting celestial scenes.',
    summary:
      'A magnificent castle floating among the clouds, built with quartz and prismarine, featuring tall spires and waterfalls.',
    imageUrl: 'https://placehold.co/1280x720/000000/FFFFFF/png?text=Minecraft+Castle',
    tags: ['castle', 'fantasy', 'survival-friendly', 'mega-build'],
    status: 'approved',
    createdAt: new Date('2023-10-26T10:00:00Z'),
    likes: 128,
    comments: [
      { id: 'c1', author: 'BuilderBoi', text: 'This is absolutely insane! The detail is incredible.', createdAt: new Date('2023-10-26T11:00:00Z') },
      { id: 'c2', author: 'CraftyGal', text: 'Wow, I wish I could build like that!', createdAt: new Date('2023-10-26T12:30:00Z') },
    ],
  },
  {
    id: '2',
    name: 'Underground Dwarven City',
    builderName: 'Steve',
    description:
      "Carved deep into a mountain, this dwarven city is a marvel of underground engineering. It features a grand hall with massive pillars, a bustling marketplace, a functional minecart system, and lava forges that light up the stone halls. The city is self-sufficient with underground farms and reservoirs.",
    summary:
      'An underground dwarven city carved into a mountain, featuring a grand hall, marketplace, and minecart system.',
    imageUrl: 'https://placehold.co/1280x720/331a00/FFFFFF/png?text=Dwarven+City',
    tags: ['underground', 'dwarven', 'city', 'engineering'],
    status: 'approved',
    createdAt: new Date('2023-10-25T14:30:00Z'),
    likes: 256,
    comments: [],
  },
  {
    id: '3',
    name: 'Modern Minimalist Villa',
    builderName: 'Jane',
    description:
      'A sleek and modern villa with clean lines and an open-plan design. Built with concrete, glass, and wood planks, it boasts a swimming pool, a rooftop terrace, and large windows offering panoramic views of the surrounding landscape. The interior is decorated with minimalist furniture and smart redstone lighting.',
    summary:
      'A sleek modern villa with a minimalist design, swimming pool, and rooftop terrace.',
    imageUrl: 'https://placehold.co/1280x720/ffffff/000000/png?text=Modern+Villa',
    tags: ['modern', 'villa', 'architecture', 'redstone'],
    status: 'approved',
    createdAt: new Date('2023-10-24T18:00:00Z'),
    likes: 98,
    comments: [],
  },
    {
    id: '4',
    name: 'Steampunk Airship',
    builderName: 'Chris',
    description:
      'A massive steampunk airship designed for exploration. It has a detailed engine room with moving parts, a luxurious captain\'s quarters, and a deck with cannons. The balloon is made of striped wool, and the ship is adorned with copper and brass details.',
    summary: 'A detailed steampunk airship with a full interior and intricate engine room.',
    imageUrl: 'https://placehold.co/1280x720/b38600/FFFFFF/png?text=Steampunk+Airship',
    tags: ['steampunk', 'airship', 'vehicle'],
    status: 'pending',
    createdAt: new Date('2023-10-27T09:00:00Z'),
    likes: 45,
    comments: [],
  },
];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function getBuilds(): Promise<Build[]> {
  await delay(100);
  return builds;
}

export async function getBuildById(id: string): Promise<Build | undefined> {
  await delay(50);
  return builds.find((build) => build.id === id);
}

export async function addBuild(build: Omit<Build, 'id' | 'createdAt' | 'likes' | 'comments'>): Promise<Build> {
  await delay(200);
  const newBuild: Build = {
    ...build,
    id: Date.now().toString(),
    createdAt: new Date(),
    likes: 0,
    comments: [],
  };
  builds.unshift(newBuild);
  revalidatePath('/');
  revalidatePath('/submit');
  return newBuild;
}

export async function updateBuild(
  id: string,
  updates: Partial<Omit<Build, 'id'>>
): Promise<Build | null> {
  await delay(100);
  const buildIndex = builds.findIndex((build) => build.id === id);
  if (buildIndex === -1) {
    return null;
  }
  builds[buildIndex] = { ...builds[buildIndex], ...updates };
  revalidatePath(`/build/${id}`);
  return builds[buildIndex];
}

export async function addLike(buildId: string): Promise<Build | null> {
  await delay(50);
  const buildIndex = builds.findIndex((build) => build.id === buildId);
  if (buildIndex === -1) return null;

  builds[buildIndex].likes++;
  revalidatePath(`/build/${buildId}`);
  return builds[buildIndex];
}

export async function addComment(buildId: string, author: string, text: string): Promise<Comment | null> {
  await delay(100);
  const buildIndex = builds.findIndex((build) => build.id === buildId);
  if (buildIndex === -1) return null;

  const newComment: Comment = {
    id: `c${Date.now()}`,
    author,
    text,
    createdAt: new Date(),
  };

  builds[buildIndex].comments.unshift(newComment);
  revalidatePath(`/build/${buildId}`);
  return newComment;
}

export async function deleteBuild(id: string): Promise<boolean> {
  await delay(100);
  const initialLength = builds.length;
  builds = builds.filter((build) => build.id !== id);
  const success = builds.length < initialLength;
  if(success) {
    revalidatePath('/');
  }
  return success;
}
