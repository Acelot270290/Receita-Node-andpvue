import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Recipe } from './Recipe';

@Entity('categorias') // Mapeia para a tabela 'categorias' do seu banco
export class Category {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    nome!: string;

    // Relação opcional, mas útil: Uma categoria pode ter muitas receitas.
    @OneToMany(() => Recipe, recipe => recipe.category)
    receitas!: Recipe[];
}
