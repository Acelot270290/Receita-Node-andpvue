import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    BeforeInsert, // Vamos usar este "gatilho"
    BeforeUpdate, // E este também
    Index 
} from 'typeorm';
import bcrypt from 'bcryptjs';

@Entity('usuarios') 
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    @Index({ unique: true })
    login!: string;

    @Column()
    senha!: string;

    @Column({ nullable: true })
    nome?: string;

    // MUDANÇA 1: Usaremos @Column simples, sem mágica.
    @Column({ name: 'criado_em', type: 'timestamp' })
    criado_em!: Date;

    // MUDANÇA 2: @Column simples aqui também.
    @Column({ name: 'alterado_em', type: 'timestamp' })
    alterado_em!: Date;
    
    // MUDANÇA 3: A SOLUÇÃO!
    // Este método será executado automaticamente ANTES de um novo usuário ser inserido.
    @BeforeInsert()
    setCreationAndUpdateDate() {
        const now = new Date();
        this.criado_em = now;
        this.alterado_em = now; // Na criação, as duas datas são iguais.
    }

    // MUDANÇA 4:
    // Este método será executado ANTES de um usuário ser atualizado.
    @BeforeUpdate()
    setUpdateDate() {
        this.alterado_em = new Date();
    }

    // A lógica de criptografar a senha continua a mesma.
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.senha) {
            if (!this.senha.startsWith('$2a$') && !this.senha.startsWith('$2b$')) {
                const salt = await bcrypt.genSalt(10);
                this.senha = await bcrypt.hash(this.senha, salt);
            }
        }
    }

    async comparePassword(candidatePassword: string): Promise<boolean> {
        return bcrypt.compare(candidatePassword, this.senha);
    }
}
