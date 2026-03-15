package mysql

import (
	"context"
	"database/sql"

	domaindm "github.com/k21hornet/inuminati/internal/domain/dm"
)

type dmRepository struct {
	db *sql.DB
}

func NewDMRepository(db *sql.DB) domaindm.Repository {
	return &dmRepository{db: db}
}

func (r *dmRepository) Save(ctx context.Context, msg *domaindm.DirectMessage) error {
	_, err := r.db.ExecContext(ctx,
		`INSERT INTO direct_messages (id, sender_id, receiver_id, content, created_at)
		 VALUES (?, ?, ?, ?, ?)`,
		msg.ID, msg.SenderID, msg.ReceiverID, msg.Content, msg.CreatedAt,
	)
	return err
}

// FindConversationは2ユーザー間のメッセージを時系列昇順で返す。
func (r *dmRepository) FindConversation(ctx context.Context, userID1, userID2 string, limit, offset int) ([]*domaindm.DirectMessage, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT id, sender_id, receiver_id, content, created_at
		 FROM direct_messages
		 WHERE (sender_id = ? AND receiver_id = ?)
		    OR (sender_id = ? AND receiver_id = ?)
		 ORDER BY created_at ASC
		 LIMIT ? OFFSET ?`,
		userID1, userID2, userID2, userID1, limit, offset,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanMessages(rows)
}

// FindConversationsは自分が参加する会話ごとの最新メッセージ一覧を返す。
//
// 実装方針:
//  1. LEAST/GREATESTで会話を (user1, user2) に正規化してグループ化
//  2. グループごとの MAX(created_at) を取得
//  3. 元テーブルと結合して最新の1行だけ取り出す
//  4. JOINで相手のユーザー名も取得
func (r *dmRepository) FindConversations(ctx context.Context, myUserID string) ([]*domaindm.ConversationSummary, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT
			CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END AS partner_id,
			u.username   AS partner_username,
			u.avatar_url AS partner_avatar_url,
			m.content    AS last_content,
			m.created_at AS last_message_at
		FROM direct_messages m
		INNER JOIN (
			SELECT
				LEAST(sender_id, receiver_id)    AS user1,
				GREATEST(sender_id, receiver_id) AS user2,
				MAX(created_at)                  AS latest
			FROM direct_messages
			WHERE sender_id = ? OR receiver_id = ?
			GROUP BY user1, user2
		) AS latest_per_conv
		  ON LEAST(m.sender_id, m.receiver_id)    = latest_per_conv.user1
		 AND GREATEST(m.sender_id, m.receiver_id) = latest_per_conv.user2
		 AND m.created_at                          = latest_per_conv.latest
		JOIN users u
		  ON u.id = CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END
		ORDER BY m.created_at DESC
	`, myUserID, myUserID, myUserID, myUserID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []*domaindm.ConversationSummary
	for rows.Next() {
		var s domaindm.ConversationSummary
		if err := rows.Scan(&s.PartnerID, &s.PartnerUsername, &s.PartnerAvatarURL, &s.LastContent, &s.LastMessageAt); err != nil {
			return nil, err
		}
		list = append(list, &s)
	}
	return list, rows.Err()
}

func scanMessages(rows *sql.Rows) ([]*domaindm.DirectMessage, error) {
	var msgs []*domaindm.DirectMessage
	for rows.Next() {
		var m domaindm.DirectMessage
		if err := rows.Scan(&m.ID, &m.SenderID, &m.ReceiverID, &m.Content, &m.CreatedAt); err != nil {
			return nil, err
		}
		msgs = append(msgs, &m)
	}
	return msgs, rows.Err()
}
