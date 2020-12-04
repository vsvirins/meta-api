export default interface IProjectRepository {
  save: (username: string, projectName: any) => void
  remove: () => void
  findAll: () => void
  findById: () => void
}