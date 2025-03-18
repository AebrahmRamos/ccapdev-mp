import PropTypes from "prop-types";
import styles from "../styles/CafeDetails.module.css";

export function EditReviewForm({ review, onSave, onCancel }) {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedReview = {
            textReview: formData.get("textReview"),
            rating: {
                ambiance: parseInt(formData.get("ambiance")),
                drinkQuality: parseInt(formData.get("drinkQuality")),
                service: parseInt(formData.get("service")),
                wifiReliability: parseInt(formData.get("wifiReliability")),
                cleanliness: parseInt(formData.get("cleanliness")),
                valueForMoney: parseInt(formData.get("valueForMoney"))
            }
        };
        console.log('Submitting updated review:', updatedReview);
        await onSave(updatedReview);
    };

    console.log('Current review data:', review);

    return (
        <form onSubmit={handleSubmit} className={styles.editReviewForm}>
            <div className={styles.ratingInputs}>
                <div>
                    <label>Ambiance:</label>
                    <input
                        type="number"
                        name="ambiance"
                        min="1"
                        max="5"
                        defaultValue={review.rating.ambiance}
                        required
                    />
                </div>
                <div>
                    <label>Drink Quality:</label>
                    <input
                        type="number"
                        name="drinkQuality"
                        min="1"
                        max="5"
                        defaultValue={review.rating.drinkQuality}
                        required
                    />
                </div>
                <div>
                    <label>Service:</label>
                    <input
                        type="number"
                        name="service"
                        min="1"
                        max="5"
                        defaultValue={review.rating.service}
                        required
                    />
                </div>
                <div>
                    <label>Wi-Fi Reliability:</label>
                    <input
                        type="number"
                        name="wifiReliability"
                        min="1"
                        max="5"
                        defaultValue={review.rating.wifiReliability}
                        required
                    />
                </div>
                <div>
                    <label>Cleanliness:</label>
                    <input
                        type="number"
                        name="cleanliness"
                        min="1"
                        max="5"
                        defaultValue={review.rating.cleanliness}
                        required
                    />
                </div>
                <div>
                    <label>Value for Money:</label>
                    <input
                        type="number"
                        name="valueForMoney"
                        min="1"
                        max="5"
                        defaultValue={review.rating.valueForMoney}
                        required
                    />
                </div>
            </div>
            <div className={styles.reviewTextArea}>
                <label>Review:</label>
                <textarea
                    name="textReview"
                    defaultValue={review.textReview}
                    required
                    rows="4"
                />
            </div>
            <div className={styles.formButtons}>
                <button type="submit" className={styles.saveButton}>
                    Save Changes
                </button>
                <button type="button" onClick={onCancel} className={styles.cancelButton}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

EditReviewForm.propTypes = {
    review: PropTypes.shape({
        textReview: PropTypes.string.isRequired,
        rating: PropTypes.shape({
            ambiance: PropTypes.number.isRequired,
            drinkQuality: PropTypes.number.isRequired,
            service: PropTypes.number.isRequired,
            wifiReliability: PropTypes.number.isRequired,
            cleanliness: PropTypes.number.isRequired,
            valueForMoney: PropTypes.number.isRequired
        }).isRequired
    }).isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};
