import { computed, ref } from 'vue';

// todo https://web.dev/articles/indexeddb
//const handleDb = "pata-fs-handlers"

export function useFileSystem() {
const fsHandle = ref<FileSystemDirectoryHandle | null>()
  async function openFolder() {
    fsHandle.value = await window.showDirectoryPicker({ 
      mode: "readwrite",
      startIn: "documents",
    })
    return getFiles()
  }
  
  type File = { name: string }

  const files = ref<File[]>([])

  async function getFiles() {
    if (!fsHandle.value) return 
    const newFiles = []
    for await (const entry of fsHandle.value.values()) {
      if (entry.kind === "file" && entry.name.endsWith(".sw")) {
        newFiles.push({ name: entry.name })
      }
    }
     newFiles.sort((a, b) => a.name.localeCompare(b.name))
    files.value = newFiles
  }

  setInterval(() => {
    if (!fsHandle.value) return
    getFiles()
  }, 5000)

  //const files = computed(async () => {
  //  if (!fsHandle) return []
  //  const files: { name: string }[] = []
  //  const entries = fsHandle.values()
  //  for await (const entry of entries) {
  //    if (entry.kind === "file") {
  //      files.push(entry)
  //    }
  //  }
  //  return files })

  return {
    files,
    folderIsOpen: computed(() => !!fsHandle.value),
    openFolder,
    isSupported: !!window.showOpenFilePicker
  }
}
