import prismaClient from "../../prisma";

interface CategoryRequest{
  name: string;
}


class CreateCategoryService {
  async execute({name}: CategoryRequest ){


    if(name === ''){
      throw new Error('Nome inválido')
    }

    //cadastrando uma nova categoria no banco de dados
    const category = await prismaClient.category.create({
      data:{
        name: name,
      },
      select:{
        id: true,
        name: true,
      }
    })

    return category;

  }
}

export{CreateCategoryService};

