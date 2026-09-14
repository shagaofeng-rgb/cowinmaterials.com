import { ExternalLink } from "lucide-react";
import styles from "./office-map.module.css";

export function OfficeMap() {
  return (
    <section className={styles.map} aria-label="Cowin Materials office map">
      <div className={styles.heading}>
        <h2>Find our office</h2>
        <a href="https://maps.app.goo.gl/P1YyVHoCdGBd9ef37" target="_blank" rel="noopener noreferrer">
          Open in Google Maps <ExternalLink size={16} aria-hidden="true" />
        </a>
      </div>
      <iframe
        title="Google Maps: Cowin Materials office location in Quzhou"
        src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3490.7477983046115!2d118.83975!3d28.965204000000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjjCsDU3JzU0LjciTiAxMTjCsDUwJzIzLjEiRQ!5e0!3m2!1sen!2s!4v1789374052766!5m2!1sen!2s"
        width="800"
        height="450"
        loading="lazy"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </section>
  );
}
