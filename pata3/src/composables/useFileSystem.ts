import { computed, ref, watchEffect } from "vue";
import { set, get } from "idb-keyval";

// todo https://web.dev/articles/indexeddb
const handleKey = "pata";

export function useFileSystem() {
  const fsHandle = ref<FileSystemDirectoryHandle | null>();
  async function openFolder() {
    let handle: FileSystemDirectoryHandle | undefined = await get(handleKey);

    if (!handle) {
      handle = await window.showDirectoryPicker({
        mode: "readwrite",
        startIn: "documents",
      });

      if (handle) {
        await set(handleKey, handle);
      }
    }

    if (!handle) return;

    fsHandle.value = handle;

    return getFiles();
  }

  const isLoading = ref(true);

  watchEffect(async () => {
    const handle: FileSystemDirectoryHandle | undefined = await get(handleKey);

    if (handle) {
      fsHandle.value = handle;
      await getFiles();
    }

    isLoading.value = false;
  })

  type File = { name: string };

  const files = ref<File[]>([]);

  async function getFiles() {
    if (!fsHandle.value) return;
    const newFiles = [];
    for await (const entry of fsHandle.value.values()) {
      if (entry.kind === "file" && entry.name.endsWith(".sw")) {
        newFiles.push({ name: entry.name });
      }
    }
    newFiles.sort((a, b) => a.name.localeCompare(b.name));
    files.value = newFiles;
  }

  setInterval(() => {
    if (!fsHandle.value) return;
    getFiles();
  }, 5000);

  async function readFile(fileName: string) {
    for await (const entry of fsHandle.value!.values()) {
      if (entry.kind === "file" && entry.name === fileName) {
        const file = await entry.getFile();
        const text = await file.text();
        return text;
      }
    }
  }


  return {
    files,
    readFile,
    folderIsOpen: computed(() => !!fsHandle.value),
    openFolder,
    isLoading,
    isSupported: !!window.showOpenFilePicker,
  };
}
