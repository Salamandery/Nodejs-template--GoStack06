import { getRepository } from 'typeorm';
import Category from '../models/Category';

class CreateCategoryService {
  async execute(title: string): Promise<string> {
    // Criando repositório da categoria
    const categoryRepository = getRepository(Category);
    // Buscando categoria existente
    let category = await categoryRepository.findOne({ where: { title } });
    // Senão existe cria uma categoria nova
    if (!category) {
      // Criando nova categoria no repositório
      category = categoryRepository.create({
        title,
      });
      // Salvando nova categoria
      await categoryRepository.save(category);
    }
    // Retornando id da categoria
    return category.id;
  }
}

export default CreateCategoryService;
