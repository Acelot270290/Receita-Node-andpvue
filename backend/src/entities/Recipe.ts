import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    BeforeUpdate,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { User } from './User';
import { Category } from './Category';

@Entity('receitas')
export class Recipe {

    @PrimaryGeneratedColumn()
    id!: number;

    // ✅ CORREÇÃO: A propriedade agora se chama 'nome' para bater com a coluna do banco.
    @Column({ name: 'nome', length: 45 })
    nome!: string;

    @Column({ name: 'tempo_preparo_minutos', type: 'int', unsigned: true, nullable: true })
    tempo_preparo?: number;

    // ✅ NOVO: Adicionamos a coluna 'porcoes' que estava faltando.
    @Column({ name: 'porcoes', type: 'int', unsigned: true, nullable: true })
    porcoes?: number;

    @Column({ name: 'modo_preparo', type: 'text' })
    modo_preparo!: string;
    
    // A coluna no banco é 'text', então o JSON será armazenado como string.
    @Column({ name: 'ingredientes', type: 'text' })
    ingredientes!: string; // O frontend enviará um array, mas salvaremos como JSON string.

    // ✅ CORREÇÃO: O JoinColumn agora aponta para 'id_usuarios'.
    @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_usuarios' })
    user!: User;

    // ✅ CORREÇÃO: O JoinColumn agora aponta para 'id_categorias'.
    @ManyToOne(() => Category, category => category.receitas, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'id_categorias' })
    category!: Category;

    // A lógica de datas que funciona para você.
    @Column({ name: 'criado_em', type: 'datetime' })
    criado_em!: Date;

    @Column({ name: 'alterado_em', type: 'datetime' })
    alterado_em!: Date;

    @BeforeInsert()
    setCreationDate() {
        this.criado_em = new Date();
        this.alterado_em = new Date();
    }

    @BeforeUpdate()
    setUpdateDate() {
        this.alterado_em = new Date();
    }
}
