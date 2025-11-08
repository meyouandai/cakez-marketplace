// Shared design storage for demo purposes
// In a real app, this would be a database

class DesignStorage {
  private designs = new Map()

  set(id: string, design: any) {
    this.designs.set(id, design)
  }

  get(id: string) {
    return this.designs.get(id)
  }

  getAll() {
    return Array.from(this.designs.values())
  }

  delete(id: string) {
    this.designs.delete(id)
  }

  getUserDesigns(userId: string) {
    return Array.from(this.designs.values()).filter(
      design => design.userId === userId
    )
  }

  keys() {
    return this.designs.keys()
  }

  entries() {
    return this.designs.entries()
  }
}

export const designStorage = new DesignStorage()
