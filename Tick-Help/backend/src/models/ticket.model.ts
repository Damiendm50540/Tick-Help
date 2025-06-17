import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import User from './user.model';

export enum TicketStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved'
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

interface TicketAttributes {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigneeId: string | null;
  createdById: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TicketCreationAttributes extends Omit<TicketAttributes, 'id'> {}

class Ticket extends Model<TicketAttributes, TicketCreationAttributes> implements TicketAttributes {
  public id!: string;
  public title!: string;
  public description!: string;
  public status!: TicketStatus;
  public priority!: TicketPriority;
  public assigneeId!: string | null;
  public createdById!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Ticket.init(
  {
    id: {
      type: DataTypes.CHAR(36),
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(TicketStatus)),
      defaultValue: TicketStatus.TODO,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM(...Object.values(TicketPriority)),
      defaultValue: TicketPriority.MEDIUM,
      allowNull: false,
    },
    assigneeId: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: User,
        key: 'id',
      },
    },
    createdById: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Ticket',
    tableName: 'tickets',
  }
);

// Define associations
Ticket.belongsTo(User, {
  foreignKey: 'assigneeId',
  as: 'assignee',
});

Ticket.belongsTo(User, {
  foreignKey: 'createdById',
  as: 'creator',
});

export default Ticket;
