import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import User from './user.model';
import Ticket from './ticket.model';

interface TicketHistoryAttributes {
  id: string;
  ticketId: string;
  userId: string;
  field: string;
  oldValue: string | null;
  newValue: string | null;
  createdAt?: Date;
}

interface TicketHistoryCreationAttributes extends Omit<TicketHistoryAttributes, 'id'> {}

class TicketHistory extends Model<TicketHistoryAttributes, TicketHistoryCreationAttributes> implements TicketHistoryAttributes {
  public id!: string;
  public ticketId!: string;
  public userId!: string;
  public field!: string;
  public oldValue!: string | null;
  public newValue!: string | null;

  public readonly createdAt!: Date;
}

TicketHistory.init(
  {
    id: {
      type: DataTypes.CHAR(36),
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ticketId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: Ticket,
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    field: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    oldValue: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    newValue: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'TicketHistory',
    tableName: 'ticket_history',
    timestamps: true,
    updatedAt: false,
  }
);

// Define associations
TicketHistory.belongsTo(Ticket, {
  foreignKey: 'ticketId',
  as: 'ticket',
});

TicketHistory.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

export default TicketHistory;
